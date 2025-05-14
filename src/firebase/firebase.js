// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, applyActionCode, checkActionCode } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, getDoc, updateDoc, setDoc, deleteDoc, onSnapshot, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Import Firebase configuration from separate file
import firebaseConfig from './firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Use local emulators for development if needed
const useEmulators = false; // Set to true to use local emulators
if (useEmulators) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// Authentication functions
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    // Special mock admin account for testing
    if (email === 'admin@historia.ai' && password === 'admin123') {
      // Return a mock user object that mimics Firebase Auth user
      return {
        uid: 'admin-mock-uid-123',
        email: 'admin@historia.ai',
        emailVerified: true,
        displayName: 'Admin User',
        mockUser: true // Flag to identify this is a mock user
      };
    }

    // Regular Firebase authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Generate a random 6-digit code (client-side fallback if cloud function fails)
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Import email service
import { sendVerificationEmail, logVerificationCode } from '../services/emailService';

// Generate and store verification code - simplified for development
export const sendVerificationCode = async (email, fullName) => {
  try {
    // Generate a verification code
    const verificationCode = generateVerificationCode();
    
    // Store code in Firestore with 30-minute expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    
    await setDoc(doc(db, "verificationCodes", email), {
      code: verificationCode,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: Timestamp.now(),
      attempts: 0
    });
    
    // Log the code prominently in console
    console.log('===================================');
    console.log(`✅ VERIFICATION CODE: ${verificationCode}`);
    console.log(`📧 For user: ${email}`);
    console.log(`👤 Name: ${fullName}`);
    console.log('===================================');
    
    // In development mode, we'll return the code directly
    // This allows the UI to display it without email integration
    return { 
      success: true, 
      fallback: true, 
      code: verificationCode,
      email: email,
      fullName: fullName
    };
  } catch (error) {
    console.error("Error in verification code process:", error);
    throw error;
  }
};

// Verify the code entered by the user
export const verifyCode = async (email, code) => {
  try {
    // Try to use the cloud function first
    const verifyCodeFn = httpsCallable(functions, 'verifyCode');
    const result = await verifyCodeFn({ email, code });
    
    // If cloud function verification succeeded, update user status
    if (result.data.success) {
      await updateUserStatusByEmail(email, 'Active');
    }
    
    return result.data;
  } catch (error) {
    console.error("Error verifying code with cloud function:", error);
    
    // Fallback to client-side verification
    console.warn("Using fallback verification method");
    
    // Get the verification code from Firestore - using the email as the document ID
    // This matches how we stored it in sendVerificationCode function
    const codeDocRef = doc(db, "verificationCodes", email);
    const codeDocSnap = await getDoc(codeDocRef);
    
    if (!codeDocSnap.exists()) {
      console.error(`No verification code found for email: ${email}`);
      throw new Error("No verification code found for this email");
    }
    
    const codeData = codeDocSnap.data();
    
    // Check if code is expired
    if (codeData.expiresAt.toDate() < new Date()) {
      throw new Error("Verification code has expired");
    }
    
    // Update attempts
    await updateDoc(doc(db, "verificationCodes", email), {
      attempts: codeData.attempts + 1
    });
    
    // Check if code matches
    if (codeData.code !== code) {
      // If too many attempts (5+), invalidate the code
      if (codeData.attempts >= 4) {
        await deleteDoc(doc(db, "verificationCodes", email));
        throw new Error("Too many failed attempts. Please request a new code.");
      }
      
      throw new Error("Invalid verification code");
    }
    
    // Code is valid, delete it from Firestore (one-time use)
    await deleteDoc(doc(db, "verificationCodes", email));
    
    // Update user status to Active after successful verification
    // This will update the existing user instead of creating a new one
    const updateResult = await updateUserStatusByEmail(email, 'Active');
    
    if (!updateResult) {
      console.warn(`Could not find user with email ${email} to update status`);
    } else {
      console.log(`Successfully updated user ${email} status to Active`);
    }
    
    return { success: true, fallback: true };
  }
};

export const registerWithEmailAndPassword = async (email, password, fullName, role) => {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send verification code instead of email verification link
    const verificationResult = await sendVerificationCode(email, fullName);
    
    // Save additional user data to Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: email,
      fullName: fullName,
      role: role,
      status: "Pending Verification",
      emailVerified: false,
      createdOn: Timestamp.now(),
      lastSeen: Timestamp.now(),
      // Store verification code reference for development
      verificationCode: verificationResult.code
    });
    
    // Return both the user and the verification result
    // This allows the UI to display the code without needing email
    return {
      user: user,
      verificationResult: verificationResult
    };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Firestore functions
export const getUserByUID = async (uid) => {
  try {
    // Special case for mock admin user
    if (uid === 'admin-mock-uid-123') {
      return {
        id: 'admin-mock-id',
        uid: 'admin-mock-uid-123',
        email: 'admin@historia.ai',
        fullName: 'Historia Admin',
        role: 'Enterprise Admin',
        status: 'Active',
        createdOn: new Date().toLocaleString(),
        lastSeen: new Date().toLocaleString()
      };
    }

    // Regular Firestore query
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return { id: querySnapshot.docs[0].id, ...userData };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    // Get users from Firestore
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const firestoreUsers = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdOn: doc.data().createdOn?.toDate().toLocaleString() || '',
      lastSeen: doc.data().lastSeen?.toDate().toLocaleString() || ''
    }));
    
    // Include mock admin in the results
    const mockAdmin = {
      id: 'admin-mock-id',
      uid: 'admin-mock-uid-123',
      email: 'admin@historia.ai',
      fullName: 'Historia Admin',
      role: 'Enterprise Admin',
      status: 'Active',
      createdOn: '1 Jan 2025 00:00 AM',
      lastSeen: 'Just now'
    };
    
    // Add some mock teacher and student users for demo purposes
    const mockUsers = [
      mockAdmin,
      {
        id: 'teacher-mock-id',
        uid: 'teacher-mock-uid-123',
        email: 'teacher@historia.ai',
        fullName: 'Sample Teacher',
        role: 'Teacher',
        status: 'Active',
        createdOn: '15 Jan 2025 10:30 AM',
        lastSeen: '2 hours ago'
      },
      {
        id: 'student-mock-id',
        uid: 'student-mock-uid-123',
        email: 'student@historia.ai',
        fullName: 'Sample Student',
        role: 'Student',
        status: 'Active',
        createdOn: '20 Jan 2025 09:15 AM',
        lastSeen: '1 day ago'
      }
    ];
    
    // If we already have real users, don't add mock ones except admin
    return firestoreUsers.length > 0 ? [mockAdmin, ...firestoreUsers] : mockUsers;
  } catch (error) {
    console.error('Error getting users:', error);
    
    // Fallback to just mock users if there's an error
    return [
      {
        id: 'admin-mock-id',
        uid: 'admin-mock-uid-123',
        email: 'admin@historia.ai',
        fullName: 'Historia Admin',
        role: 'Enterprise Admin',
        status: 'Active',
        createdOn: '1 Jan 2025 00:00 AM',
        lastSeen: 'Just now'
      },
      {
        id: 'teacher-mock-id',
        uid: 'teacher-mock-uid-123',
        email: 'teacher@historia.ai',
        fullName: 'Sample Teacher',
        role: 'Teacher',
        status: 'Active',
        createdOn: '15 Jan 2025 10:30 AM',
        lastSeen: '2 hours ago'
      },
      {
        id: 'student-mock-id',
        uid: 'student-mock-uid-123',
        email: 'student@historia.ai',
        fullName: 'Sample Student',
        role: 'Student',
        status: 'Active',
        createdOn: '20 Jan 2025 09:15 AM',
        lastSeen: '1 day ago'
      }
    ];
  }
};

export const updateUserLastSeen = async (uid) => {
  try {
    // Skip for mock admin user
    if (uid === 'admin-mock-uid-123') {
      return;
    }

    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
      await updateDoc(userDocRef, {
        lastSeen: Timestamp.now()
      });
    }
  } catch (error) {
    console.error("Error updating last seen:", error);
  }
};

// Delete a user by Firestore document ID
export const deleteUserById = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user status by email
export const updateUserStatusByEmail = async (email, newStatus) => {
  try {
    // Find the user document by email
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn(`No user found with email ${email} to update status`);
      return false;
    }
    
    // Update the user's status
    const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
    await updateDoc(userDocRef, {
      status: newStatus,
      // If activating the user, also update the lastSeen timestamp
      ...(newStatus === 'Active' ? { lastSeen: Timestamp.now() } : {})
    });
    
    console.log(`User ${email} status updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Function to handle email verification link clicks
export const handleEmailVerification = async (oobCode) => {
  try {
    // Check if this is a demo verification code
    if (oobCode.startsWith('demo-verification-code-')) {
      // Extract email from the demo code
      const parts = oobCode.split('-');
      const email = parts[parts.length - 1];
      
      console.log('Processing demo verification for:', email);
      
      // Update the user's status to Active
      await updateUserStatusByEmail(email, 'Active');
      
      return { success: true, email, demo: true };
    }
    
    // Real verification code processing
    try {
      // Apply the email verification code
      await applyActionCode(auth, oobCode);
      
      // Get the user's email from the verification code
      const info = await checkActionCode(auth, oobCode);
      const email = info.data.email;
      
      // Update the user's status to Active
      await updateUserStatusByEmail(email, 'Active');
      
      return { success: true, email };
    } catch (error) {
      console.error("Error with Firebase verification:", error);
      
      // If Firebase verification fails, check if we can extract an email from the code
      // This is a fallback for development/testing
      if (oobCode.includes('@')) {
        const email = oobCode.substring(oobCode.indexOf('@') - 10).split('&')[0];
        if (email.includes('@')) {
          console.log('Attempting fallback verification for:', email);
          await updateUserStatusByEmail(email, 'Active');
          return { success: true, email, fallback: true };
        }
      }
      
      throw error;
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

// Real-time subscription to users collection
export const subscribeToUsers = (callback) => {
  const usersCollection = collection(db, "users");
  return onSnapshot(usersCollection, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  });
};

// Update user profile (name, role, status)
export const updateUserProfile = async (userId, profileData) => {
  try {
    // Skip for mock users
    if (userId === 'admin-mock-id' || userId === 'teacher-mock-id' || userId === 'student-mock-id') {
      console.log('Mock user profile updated (simulated):', profileData);
      return true;
    }

    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      ...profileData,
      lastUpdated: Timestamp.now()
    });
    
    console.log(`User ${userId} profile updated successfully`);
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Update user role specifically
export const updateUserRole = async (userId, newRole) => {
  return updateUserProfile(userId, { role: newRole });
};

export { auth, db, storage };