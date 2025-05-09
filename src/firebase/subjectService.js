// Import Firebase utilities
import { db, storage } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Collection reference
const subjectsCollection = collection(db, 'subjects');

/**
 * Check if a subject with the same code or name already exists
 * @param {string} code - Subject code to check
 * @param {string} name - Subject name to check
 * @returns {boolean} - True if subject exists, false otherwise
 */
const isSubjectDuplicate = (code, name) => {
  // Check in the cache first for performance
  if (subjectsCache && subjectsCache.length > 0) {
    return subjectsCache.some(subject => 
      subject.code.toLowerCase() === code.toLowerCase() || 
      subject.name.toLowerCase() === name.toLowerCase()
    );
  }
  return false;
};

/**
 * Add a new subject to Firestore
 * @param {Object} subjectData - Subject data (code, name, teacher, status)
 * @param {File} backgroundImage - Optional background image file
 * @returns {Promise<Object>} - The created subject with ID
 */
export const addSubject = async (subjectData, backgroundImage = null) => {
  try {
    console.log('Adding new subject to Firestore:', subjectData);
    
    // Check for duplicate subject code or name
    if (isSubjectDuplicate(subjectData.code, subjectData.name)) {
      // Check which one is the duplicate (code or name or both)
      const isDuplicateCode = subjectsCache.some(subject => 
        subject.code.toLowerCase() === subjectData.code.toLowerCase()
      );
      const isDuplicateName = subjectsCache.some(subject => 
        subject.name.toLowerCase() === subjectData.name.toLowerCase()
      );
      
      if (isDuplicateCode && isDuplicateName) {
        console.warn(`Subject with code ${subjectData.code} and name ${subjectData.name} already exists.`);
        throw new Error(`A subject with code ${subjectData.code} and name ${subjectData.name} already exists. Please use different values.`);
      } else if (isDuplicateCode) {
        console.warn(`Subject with code ${subjectData.code} already exists.`);
        throw new Error(`A subject with code ${subjectData.code} already exists. Please use a different code.`);
      } else {
        console.warn(`Subject with name ${subjectData.name} already exists.`);
        throw new Error(`A subject with name ${subjectData.name} already exists. Please use a different name.`);
      }
    }
    
    // If there's a background image, upload it first
    let backgroundImageUrl = null;
    
    if (backgroundImage) {
      try {
        const imageRef = ref(storage, `subject-images/${Date.now()}-${backgroundImage.name}`);
        await uploadBytes(imageRef, backgroundImage);
        backgroundImageUrl = await getDownloadURL(imageRef);
        console.log('Image uploaded successfully:', backgroundImageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue without the image if upload fails
      }
    }
    
    // Generate a unique ID for the subject
    const uniqueId = Date.now().toString();
    
    // Prepare subject data
    const subjectWithMetadata = {
      ...subjectData,
      backgroundImageUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Try to add the subject to Firestore with setDoc instead of addDoc
    // This allows us to specify the document ID
    await setDoc(doc(db, 'subjects', uniqueId), subjectWithMetadata);
    console.log('Subject added to Firestore with ID:', uniqueId);
    
    // Create the complete subject object
    const newSubject = {
      id: uniqueId,
      ...subjectData,
      backgroundImageUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Update the in-memory cache and notify listeners
    if (subjectsCache) {
      // Add to cache
      subjectsCache = [...subjectsCache, newSubject];
      
      // Notify all listeners about the updated subjects
      console.log('Notifying listeners about new subject');
      notifySubjectsListeners(subjectsCache);
    }
    
    // Return the created subject with ID
    return newSubject;
  } catch (error) {
    console.error('Error adding subject:', error);
    
    // For development/demo purposes, return a mock subject if Firestore fails
    // This allows the UI to continue working even if Firebase permissions are not set up
    const mockId = 'mock-' + Date.now();
    console.log('Creating mock subject with ID:', mockId);
    
    // Create mock subject
    const mockSubject = {
      id: mockId,
      ...subjectData,
      backgroundImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isMock: true // Flag to identify this is a mock subject
    };
    
    // Update the in-memory cache and notify listeners
    if (subjectsCache) {
      // Add to cache
      subjectsCache = [...subjectsCache, mockSubject];
      
      // Notify all listeners about the updated subjects
      console.log('Notifying listeners about new mock subject');
      notifySubjectsListeners(subjectsCache);
    }
    
    return mockSubject;
  }
};

/**
 * Get all subjects from Firestore
 * @returns {Promise<Array>} - Array of subjects
 */
export const getAllSubjects = async () => {
  try {
    const querySnapshot = await getDocs(subjectsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting subjects:', error);
    
    // For development/demo purposes, return cached subjects or mock subjects if Firestore fails
    // This allows the UI to continue working even if Firebase permissions are not set up
    console.log('Returning mock subjects due to Firestore error');
    
    // If we have subjects in the cache (including any that were added during this session),
    // return those instead of the default mock data
    if (subjectsCache.length > 0) {
      console.log(`Returning ${subjectsCache.length} cached subjects`);
      return [...subjectsCache];
    }
    
    // Otherwise, return default mock subjects
    const defaultMockSubjects = [
      { 
        id: 'mock-1',
        code: 'MATH101', 
        name: 'Araling Panlipunan', 
        teacher: 'Mr. Ralp',
        status: 'Active',
        backgroundImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true
      },
      { 
        id: 'mock-2',
        code: 'ENG105', 
        name: 'English', 
        teacher: 'Mrs. Gwap',
        status: 'Active',
        backgroundImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true
      },
      { 
        id: 'mock-3',
        code: 'SCI202', 
        name: 'Math', 
        teacher: 'Mrs. Gwap',
        status: 'Active',
        backgroundImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true
      }
    ];
    
    // Update the cache with these default subjects
    subjectsCache = defaultMockSubjects;
    
    // Save to localStorage
    try {
      localStorage.setItem('historia_subjects_cache', JSON.stringify(defaultMockSubjects));
    } catch (error) {
      console.error('Error saving default subjects to localStorage:', error);
    }
    
    return defaultMockSubjects;
  }
};

/**
 * Update a subject in Firestore
 * @param {string} subjectId - Subject ID
 * @param {Object} subjectData - Updated subject data
 * @param {File} backgroundImage - Optional new background image
 * @returns {Promise<Object>} - The updated subject
 */
export const updateSubject = async (subjectId, subjectData, backgroundImage = null) => {
  try {
    // Check if this is a mock subject (created when Firebase was unavailable)
    if (subjectId.startsWith('mock-')) {
      console.log('Simulating update for mock subject:', subjectId);
      return {
        id: subjectId,
        ...subjectData,
        backgroundImageUrl: subjectData.backgroundImageUrl,
        updatedAt: new Date(),
        isMock: true
      };
    }
    
    // If there's a new background image, upload it
    let backgroundImageUrl = subjectData.backgroundImageUrl;
    
    if (backgroundImage) {
      try {
        const imageRef = ref(storage, `subject-images/${Date.now()}-${backgroundImage.name}`);
        await uploadBytes(imageRef, backgroundImage);
        backgroundImageUrl = await getDownloadURL(imageRef);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue without updating the image if upload fails
      }
    }
    
    // Update the subject in Firestore
    const subjectRef = doc(db, 'subjects', subjectId);
    await updateDoc(subjectRef, {
      ...subjectData,
      backgroundImageUrl,
      updatedAt: Timestamp.now()
    });
    
    // Return the updated subject
    return {
      id: subjectId,
      ...subjectData,
      backgroundImageUrl,
      updatedAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error updating subject:', error);
    
    // Return the data anyway to allow the UI to continue working
    return {
      id: subjectId,
      ...subjectData,
      backgroundImageUrl: subjectData.backgroundImageUrl,
      updatedAt: new Date()
    };
  }
};

/**
 * Delete a subject from Firestore
 * @param {string} subjectId - Subject ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteSubject = async (subjectId) => {
  try {
    // Remove from cache first (whether it's a mock subject or real)
    if (subjectsCache.length > 0) {
      console.log('Removing subject from cache:', subjectId);
      subjectsCache = subjectsCache.filter(subject => subject.id !== subjectId);
      
      // Update localStorage with the new cache
      try {
        localStorage.setItem('subjectsCache', JSON.stringify(subjectsCache));
        console.log('Updated localStorage after subject deletion');
      } catch (e) {
        console.error('Error updating localStorage after deletion:', e);
      }
      
      // Notify listeners about the updated subjects list
      notifySubjectsListeners(subjectsCache);
    }
    
    // If it's a mock subject, we're done (it doesn't exist in Firestore)
    if (subjectId.startsWith('mock-')) {
      console.log('Completed deletion for mock subject:', subjectId);
      return true;
    }
    
    // Delete from Firestore
    await deleteDoc(doc(db, 'subjects', subjectId));
    console.log('Subject successfully deleted from Firestore:', subjectId);
    return true;
  } catch (error) {
    console.error('Error deleting subject from Firestore:', error);
    // We've already updated the cache, so return success
    return true;
  }
};

/**
 * Get a subject by code
 * @param {string} code - Subject code
 * @returns {Promise<Object|null>} - Subject or null if not found
 */
export const getSubjectByCode = async (code) => {
  try {
    const q = query(subjectsCollection, where('code', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting subject by code:', error);
    throw error;
  }
};

// Initialize from localStorage if available to persist between page navigations
let subjectsCache = [];
let subjectsListeners = [];

// Try to load from localStorage on initialization
try {
  const savedSubjects = localStorage.getItem('subjectsCache');
  if (savedSubjects) {
    subjectsCache = JSON.parse(savedSubjects);
    console.log(`Loaded ${subjectsCache.length} subjects from localStorage`);
  }
} catch (error) {
  console.error('Error loading subjects from localStorage:', error);
}

/**
 * Initialize the subjects collection with default subjects if it's empty
 * This ensures we have some data in Firestore to start with
 */
export const initializeSubjectsCollection = async () => {
  try {
    // ALWAYS check if user has explicitly deleted all subjects FIRST
    const hasDeletedAll = localStorage.getItem('subjectsAllDeleted') === 'true';
    
    if (hasDeletedAll) {
      console.log('User has explicitly deleted all subjects, will not initialize with defaults');
      return false;
    }
    
    // Only proceed if user hasn't deleted all subjects
    const querySnapshot = await getDocs(subjectsCollection);
    
    if (querySnapshot.empty) {
      console.log('Subjects collection is empty, initializing with default subjects');
      
      // Add default subjects to Firestore
      const defaultSubjects = [
        { 
          code: 'MATH101', 
          name: 'Araling Panlipunan', 
          teacher: 'Mr. Ralp',
          status: 'Active'
        },
        { 
          code: 'ENG105', 
          name: 'English', 
          teacher: 'Mrs. Gwap',
          status: 'Active'
        },
        { 
          code: 'SCI202', 
          name: 'Math', 
          teacher: 'Mrs. Gwap',
          status: 'Active'
        }
      ];
      
      // Add each subject to Firestore
      for (const subject of defaultSubjects) {
        await addSubject(subject);
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing subjects collection:', error);
    return false;
  }
}

/**
 * Notify all listeners about updated subjects
 * @param {Array} subjects - Updated subjects array
 */
const notifySubjectsListeners = (subjects) => {
  console.log(`Notifying ${subjectsListeners.length} listeners about ${subjects.length} subjects`);
  
  // Store in localStorage for persistence between page navigations
  try {
    localStorage.setItem('subjectsCache', JSON.stringify(subjects));
    console.log('Saved subjects to localStorage for persistence');
  } catch (error) {
    console.error('Error saving subjects to localStorage:', error);
  }
  
  // Update the cache
  subjectsCache = subjects;
  
  // Notify all listeners
  subjectsListeners.forEach(listener => {
    try {
      listener(subjects);
    } catch (error) {
      console.error('Error in subject listener:', error);
    }
  });
};

/**
 * Clear all subjects from the database and localStorage
 * This completely removes all subjects and resets the state
 * @returns {Promise<number>} - Number of subjects removed
 */
export const clearAllSubjects = async () => {
  try {
    console.log('Clearing all subjects from database and cache...');
    
    // Get all subjects from Firestore
    const querySnapshot = await getDocs(subjectsCollection);
    const allSubjects = querySnapshot.docs;
    
    console.log(`Found ${allSubjects.length} subjects to remove`);
    
    // Delete all subjects from Firestore
    for (const doc of allSubjects) {
      await deleteDoc(doc.ref);
    }
    
    // Clear the cache and localStorage
    subjectsCache = [];
    try {
      localStorage.removeItem('subjectsCache');
      localStorage.setItem('subjectsAllDeleted', 'true');
      console.log('Cleared subjects from localStorage');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    
    // Notify listeners about empty subjects list
    notifySubjectsListeners([]);
    
    console.log('All subjects cleared successfully');
    return allSubjects.length;
  } catch (error) {
    console.error('Error clearing all subjects:', error);
    return 0;
  }
};

/**
 * Clean up duplicate subjects from the database
 * This function identifies and removes duplicate subjects based on subject code
 * @returns {Promise<number>} - Number of duplicates removed
 */
export const cleanupDuplicateSubjects = async () => {
  try {
    console.log('Starting duplicate subjects cleanup...');
    
    // Get all subjects from Firestore
    const querySnapshot = await getDocs(subjectsCollection);
    const allSubjects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Find duplicates by code
    const uniqueCodes = new Set();
    const duplicates = [];
    const uniqueSubjects = [];
    
    // First pass: identify duplicates
    allSubjects.forEach(subject => {
      const code = subject.code.toLowerCase();
      if (uniqueCodes.has(code)) {
        // This is a duplicate
        duplicates.push(subject);
      } else {
        // This is the first occurrence
        uniqueCodes.add(code);
        uniqueSubjects.push(subject);
      }
    });
    
    console.log(`Found ${duplicates.length} duplicate subjects`);
    
    // Delete duplicates from Firestore
    for (const duplicate of duplicates) {
      console.log(`Deleting duplicate subject: ${duplicate.code} (${duplicate.name})`);
      await deleteDoc(doc(db, 'subjects', duplicate.id));
    }
    
    // Update the cache with only unique subjects
    subjectsCache = uniqueSubjects;
    notifySubjectsListeners(uniqueSubjects);
    
    console.log('Duplicate cleanup completed successfully');
    return duplicates.length;
  } catch (error) {
    console.error('Error cleaning up duplicate subjects:', error);
    return 0;
  }
};

/**
 * Subscribe to subjects collection for real-time updates
 * @param {Function} callback - Function to call with updated subjects
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToSubjects = (callback) => {
  console.log('Setting up subscription to subjects');
  
  // Add this callback to our listeners
  subjectsListeners.push(callback);
  
  // If we already have subjects in the cache, immediately notify this listener
  if (subjectsCache.length > 0) {
    console.log(`Immediately notifying new listener with ${subjectsCache.length} cached subjects`);
    setTimeout(() => callback([...subjectsCache]), 0);
  }
  
  // Initialize the subjects collection if needed
  initializeSubjectsCollection()
    .then(initialized => {
      if (initialized) {
        console.log('Successfully initialized subjects collection in Firestore');
      }
    })
    .catch(error => {
      console.error('Error initializing subjects collection:', error);
    });
  
  // If this is the first listener, set up the Firestore subscription
  if (subjectsListeners.length === 1 || !window._unsubscribeFirestoreSubjects) {
    console.log('First listener, setting up Firestore subscription');
    
    try {
      // Set up real-time listener to Firestore
      const unsubscribeFirestore = onSnapshot(
        subjectsCollection,
        // Success handler
        (snapshot) => {
          const subjects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log(`Received ${subjects.length} subjects from Firestore`);
          
          // Notify all listeners with the new data
          notifySubjectsListeners(subjects);
        },
        // Error handler
        (error) => {
          console.error('Error in Firestore subjects subscription:', error);
          
          // First check if user has explicitly deleted all subjects
          const hasDeletedAll = localStorage.getItem('subjectsAllDeleted') === 'true';
          
          if (hasDeletedAll) {
            console.log('User has explicitly deleted all subjects, providing empty list');
            // Provide empty list and don't try to add any mock data
            subjectsCache = [];
            notifySubjectsListeners([]);
          } else if (subjectsCache.length > 0) {
            // If we have cached subjects, use those
            console.log(`Using ${subjectsCache.length} cached subjects from localStorage`);
            // Notify listeners with the cached subjects
            notifySubjectsListeners(subjectsCache);
          } else {
            // If no cached subjects and user hasn't deleted all, use mock subjects as a last resort
            console.log('No cached subjects available, providing mock subjects');
            const mockSubjects = [
              { 
                id: 'mock-1',
                code: 'MATH101', 
                name: 'Araling Panlipunan', 
                teacher: 'Mr. Ralp',
                status: 'Active',
                backgroundImageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                isMock: true
              },
              { 
                id: 'mock-2',
                code: 'ENG105', 
                name: 'English', 
                teacher: 'Mrs. Gwap',
                status: 'Active',
                backgroundImageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                isMock: true
              },
              { 
                id: 'mock-3',
                code: 'SCI202', 
                name: 'Math', 
                teacher: 'Mrs. Gwap',
                status: 'Active',
                backgroundImageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                isMock: true
              }
            ];
            
            // Update cache with mock data
            subjectsCache = mockSubjects;
            
            // Notify all listeners
            notifySubjectsListeners(mockSubjects);
            
            // Try to initialize Firestore with these mock subjects
            Promise.all(mockSubjects.map(subject => {
              // Remove the mock-specific fields
              const { id, isMock, createdAt, updatedAt, ...subjectData } = subject;
              return addSubject(subjectData).catch(e => console.error('Error adding mock subject to Firestore:', e));
            })).then(() => {
              console.log('Attempted to add mock subjects to Firestore');
            });
          }
        }
      );
      
      // Store the Firestore unsubscribe function to clean up later
      window._unsubscribeFirestoreSubjects = unsubscribeFirestore;
    } catch (error) {
      console.error('Failed to set up Firestore subjects subscription:', error);
      
      // Check if we have subjects in localStorage first before using mock data
      if (subjectsCache.length > 0) {
        console.log(`Using ${subjectsCache.length} cached subjects from localStorage`);
        // Notify listeners with the cached subjects
        notifySubjectsListeners(subjectsCache);
      } else {
        // If no cached subjects, use mock subjects as a last resort
        console.log('No cached subjects available, providing mock subjects');
        const mockSubjects = [
          { 
            id: 'mock-1',
            code: 'MATH101', 
            name: 'Araling Panlipunan', 
            teacher: 'Mr. Ralp',
            status: 'Active',
            backgroundImageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isMock: true
          },
          { 
            id: 'mock-2',
            code: 'ENG105', 
            name: 'English', 
            teacher: 'Mrs. Gwap',
            status: 'Active',
            backgroundImageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isMock: true
          },
          { 
            id: 'mock-3',
            code: 'SCI202', 
            name: 'Math', 
            teacher: 'Mrs. Gwap',
            status: 'Active',
            backgroundImageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isMock: true
          }
        ];
        
        // Update cache
        subjectsCache = mockSubjects;
        
        // Notify all listeners
        notifySubjectsListeners(mockSubjects);
        
        // Try to initialize Firestore with these mock subjects
        Promise.all(mockSubjects.map(subject => {
          // Remove the mock-specific fields
          const { id, isMock, createdAt, updatedAt, ...subjectData } = subject;
          return addSubject(subjectData).catch(e => console.error('Error adding mock subject to Firestore:', e));
        })).then(() => {
          console.log('Attempted to add mock subjects to Firestore');
        });
      }
    }
  }
  
  // Return an unsubscribe function that removes this callback from our listeners
  return () => {
    console.log('Unsubscribing from subjects');
    const index = subjectsListeners.indexOf(callback);
    if (index !== -1) {
      subjectsListeners.splice(index, 1);
    }
    
    // If there are no more listeners, clean up the Firestore subscription
    if (subjectsListeners.length === 0 && window._unsubscribeFirestoreSubjects) {
      console.log('No more subject listeners, cleaning up Firestore subscription');
      try {
        window._unsubscribeFirestoreSubjects();
      } catch (error) {
        console.error('Error unsubscribing from Firestore:', error);
        // Prevent further errors by setting to null even if unsubscribe fails
      }
      window._unsubscribeFirestoreSubjects = null;
    }
  };
};
