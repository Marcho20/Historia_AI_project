// badgeService.js
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Using localStorage as fallback when Firebase permissions are unavailable
const LOCAL_BADGES_KEY = 'historia_ai_badges';
const LOCAL_STUDENT_BADGES_KEY = 'historia_ai_student_badges';

// Check if we should use mock implementation due to Firebase permission issues
const useMockImplementation = true; // Set to true to bypass Firebase permissions

const BADGES_COLLECTION = 'badges';
const STUDENT_BADGES_COLLECTION = 'studentBadges';

// Helper function to generate a unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Create a new badge
export const createBadge = async (badgeData, imageFile) => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for createBadge');
      // Generate a mock image URL if file is provided
      let imageUrl = '';
      if (imageFile) {
        // Create a data URL from the file for preview purposes
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            imageUrl = reader.result;
            createMockBadge(badgeData, imageUrl, resolve);
          };
          reader.readAsDataURL(imageFile);
        });
      } else {
        // No image file
        return createMockBadge(badgeData, '');
      }
    }
    
    // Original Firebase implementation
    let imageUrl = '';
    
    // If an image file is provided, upload it to Firebase Storage
    if (imageFile) {
      const storage = getStorage();
      const fileId = generateUniqueId();
      const fileExtension = imageFile.name.split('.').pop();
      const storageRef = ref(storage, `badges/${fileId}.${fileExtension}`);
      
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Add the badge to Firestore
    const badgeWithImage = {
      ...badgeData,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, BADGES_COLLECTION), badgeWithImage);
    
    return {
      id: docRef.id,
      ...badgeWithImage
    };
  } catch (error) {
    console.error('Error creating badge:', error);
    throw error;
  }
};

// Helper function to create a mock badge and store in localStorage
const createMockBadge = (badgeData, imageUrl, resolveCallback) => {
  // Get existing badges
  const existingBadges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
  
  // Create new badge with generated ID and timestamps
  const timestamp = new Date().toISOString();
  const newBadge = {
    ...badgeData,
    id: generateUniqueId(),
    imageUrl,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  // Add badge to collection
  existingBadges.push(newBadge);
  localStorage.setItem(LOCAL_BADGES_KEY, JSON.stringify(existingBadges));
  
  console.log('Mock badge created:', newBadge);
  
  if (resolveCallback) {
    resolveCallback(newBadge);
  }
  return newBadge;
};

// Get all badges
export const getAllBadges = async () => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for getAllBadges');
      const badges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
      return badges;
    }
    
    const badgesSnapshot = await getDocs(collection(db, BADGES_COLLECTION));
    return badgesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting badges:', error);
    throw error;
  }
};

// Get a single badge by ID
export const getBadgeById = async (badgeId) => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for getBadgeById', badgeId);
      const badges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
      const badge = badges.find(b => b.id === badgeId);
      return badge || null;
    }
    
    const badgesSnapshot = await getDocs(
      query(collection(db, BADGES_COLLECTION), where('__name__', '==', badgeId))
    );
    
    if (badgesSnapshot.empty) {
      return null;
    }
    
    const badgeDoc = badgesSnapshot.docs[0];
    return {
      id: badgeDoc.id,
      ...badgeDoc.data()
    };
  } catch (error) {
    console.error('Error getting badge by ID:', error);
    throw error;
  }
};

// Update a badge
export const updateBadge = async (badgeId, badgeData, imageFile) => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for updateBadge', badgeId);
      
      // Get existing badges
      const badges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
      const badgeIndex = badges.findIndex(b => b.id === badgeId);
      
      if (badgeIndex === -1) {
        throw new Error('Badge not found');
      }
      
      const currentBadge = badges[badgeIndex];
      let imageUrl = currentBadge.imageUrl || '';
      
      if (imageFile) {
        // Create a data URL from the file
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            imageUrl = reader.result;
            const updatedBadge = updateMockBadge(badgeId, badgeData, imageUrl);
            resolve(updatedBadge);
          };
          reader.readAsDataURL(imageFile);
        });
      } else {
        return updateMockBadge(badgeId, badgeData, imageUrl);
      }
    }
    
    // Original Firebase implementation
    const badgeRef = doc(db, BADGES_COLLECTION, badgeId);
    
    // Get the current badge data to check if we need to delete an old image
    const currentBadgeSnapshot = await getDocs(
      query(collection(db, BADGES_COLLECTION), where('__name__', '==', badgeId))
    );
    
    if (currentBadgeSnapshot.empty) {
      throw new Error('Badge not found');
    }
    
    const currentBadge = currentBadgeSnapshot.docs[0].data();
    let imageUrl = currentBadge.imageUrl || '';
    
    // If a new image file is provided, upload it and update the URL
    if (imageFile) {
      const storage = getStorage();
      
      // Delete the old image if it exists
      if (currentBadge.imageUrl) {
        try {
          const oldImageRef = ref(storage, currentBadge.imageUrl);
          await deleteObject(oldImageRef);
        } catch (deleteError) {
          console.warn('Error deleting old image:', deleteError);
          // Continue with the update even if deleting the old image fails
        }
      }
      
      // Upload the new image
      const fileId = generateUniqueId();
      const fileExtension = imageFile.name.split('.').pop();
      const storageRef = ref(storage, `badges/${fileId}.${fileExtension}`);
      
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Update the badge in Firestore
    const updatedBadge = {
      ...badgeData,
      imageUrl,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(badgeRef, updatedBadge);
    
    return {
      id: badgeId,
      ...updatedBadge
    };
  } catch (error) {
    console.error('Error updating badge:', error);
    throw error;
  }
};

// Helper function to update a mock badge
const updateMockBadge = (badgeId, badgeData, imageUrl) => {
  // Get existing badges
  const badges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
  const badgeIndex = badges.findIndex(b => b.id === badgeId);
  
  if (badgeIndex === -1) {
    throw new Error('Badge not found');
  }
  
  // Create updated badge
  const timestamp = new Date().toISOString();
  const updatedBadge = {
    ...badges[badgeIndex],
    ...badgeData,
    imageUrl: imageUrl || badges[badgeIndex].imageUrl,
    updatedAt: timestamp
  };
  
  // Update badge in collection
  badges[badgeIndex] = updatedBadge;
  localStorage.setItem(LOCAL_BADGES_KEY, JSON.stringify(badges));
  
  console.log('Mock badge updated:', updatedBadge);
  return updatedBadge;
};

// Delete a badge
export const deleteBadge = async (badgeId) => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for deleteBadge', badgeId);
      
      // Get existing badges
      const badges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
      const badgeIndex = badges.findIndex(b => b.id === badgeId);
      
      if (badgeIndex === -1) {
        throw new Error('Badge not found');
      }
      
      // Remove the badge
      badges.splice(badgeIndex, 1);
      localStorage.setItem(LOCAL_BADGES_KEY, JSON.stringify(badges));
      
      // Also remove any student awards for this badge
      const studentBadges = JSON.parse(localStorage.getItem(LOCAL_STUDENT_BADGES_KEY) || '[]');
      const updatedStudentBadges = studentBadges.filter(sb => sb.badgeId !== badgeId);
      localStorage.setItem(LOCAL_STUDENT_BADGES_KEY, JSON.stringify(updatedStudentBadges));
      
      console.log('Mock badge deleted:', badgeId);
      return true;
    }
    
    // Original Firebase implementation
    // Get the badge data to check if there's an image to delete
    const badgeSnapshot = await getDocs(
      query(collection(db, BADGES_COLLECTION), where('__name__', '==', badgeId))
    );
    
    if (!badgeSnapshot.empty) {
      const badgeData = badgeSnapshot.docs[0].data();
      
      // Delete the image from storage if it exists
      if (badgeData.imageUrl) {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, badgeData.imageUrl);
          await deleteObject(imageRef);
        } catch (deleteError) {
          console.warn('Error deleting badge image:', deleteError);
          // Continue with the badge deletion even if image deletion fails
        }
      }
    }
    
    // Delete the badge document
    await deleteDoc(doc(db, BADGES_COLLECTION, badgeId));
    
    return true;
  } catch (error) {
    console.error('Error deleting badge:', error);
    throw error;
  }
};

// Award a badge to a student
export const awardBadgeToStudent = async (badgeId, studentId, awardedBy, reason = '') => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for awardBadgeToStudent', badgeId, studentId);
      
      // Verify badge exists
      const badges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
      const badge = badges.find(b => b.id === badgeId);
      
      if (!badge) {
        throw new Error('Badge not found');
      }
      
      // Create award data
      const timestamp = new Date().toISOString();
      const awardId = generateUniqueId();
      const awardData = {
        id: awardId,
        badgeId,
        studentId,
        awardedBy,
        reason,
        awardedAt: timestamp
      };
      
      // Store in localStorage
      const studentBadges = JSON.parse(localStorage.getItem(LOCAL_STUDENT_BADGES_KEY) || '[]');
      studentBadges.push(awardData);
      localStorage.setItem(LOCAL_STUDENT_BADGES_KEY, JSON.stringify(studentBadges));
      
      console.log('Mock badge awarded:', awardData);
      return awardData;
    }
    
    // Original Firebase implementation
    const awardData = {
      badgeId,
      studentId,
      awardedBy,
      reason,
      awardedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, STUDENT_BADGES_COLLECTION), awardData);
    
    return {
      id: docRef.id,
      ...awardData
    };
  } catch (error) {
    console.error('Error awarding badge to student:', error);
    throw error;
  }
};

// Get all badges awarded to a specific student
export const getStudentBadges = async (studentId) => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for getStudentBadges', studentId);
      
      // Get student badge awards
      const studentBadges = JSON.parse(localStorage.getItem(LOCAL_STUDENT_BADGES_KEY) || '[]');
      const userAwards = studentBadges.filter(sb => sb.studentId === studentId);
      
      // Get all badges
      const allBadges = JSON.parse(localStorage.getItem(LOCAL_BADGES_KEY) || '[]');
      
      // Merge badge details with awards
      const badgesWithDetails = userAwards.map(award => {
        const badgeDetails = allBadges.find(b => b.id === award.badgeId) || null;
        return {
          ...award,
          badge: badgeDetails
        };
      });
      
      return badgesWithDetails;
    }
    
    // Original Firebase implementation
    const badgesSnapshot = await getDocs(
      query(collection(db, STUDENT_BADGES_COLLECTION), where('studentId', '==', studentId))
    );
    
    const studentBadges = badgesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Fetch the full badge details for each awarded badge
    const badgesWithDetails = await Promise.all(
      studentBadges.map(async (awardedBadge) => {
        const badgeDetails = await getBadgeById(awardedBadge.badgeId);
        return {
          ...awardedBadge,
          badge: badgeDetails
        };
      })
    );
    
    return badgesWithDetails;
  } catch (error) {
    console.error('Error getting student badges:', error);
    throw error;
  }
};

// Remove a badge from a student
export const removeBadgeFromStudent = async (awardId) => {
  try {
    if (useMockImplementation) {
      console.log('Using mock implementation for removeBadgeFromStudent', awardId);
      
      // Get student badge awards
      const studentBadges = JSON.parse(localStorage.getItem(LOCAL_STUDENT_BADGES_KEY) || '[]');
      const awardIndex = studentBadges.findIndex(sb => sb.id === awardId);
      
      if (awardIndex === -1) {
        throw new Error('Badge award not found');
      }
      
      // Remove the award
      studentBadges.splice(awardIndex, 1);
      localStorage.setItem(LOCAL_STUDENT_BADGES_KEY, JSON.stringify(studentBadges));
      
      console.log('Mock badge award removed:', awardId);
      return true;
    }
    
    // Original Firebase implementation
    await deleteDoc(doc(db, STUDENT_BADGES_COLLECTION, awardId));
    return true;
  } catch (error) {
    console.error('Error removing badge from student:', error);
    throw error;
  }
};
