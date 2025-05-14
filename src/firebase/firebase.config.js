// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAN01Z9vZOzxHDRY4NXYXYnjVBF2o8WLlw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "historia-ai-9f2b4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "historia-ai-9f2b4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "historia-ai-9f2b4.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "799374417411",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:799374417411:web:0316dc6f2da8ee0b5af836",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8XKZ35CJDW"
};

export default firebaseConfig;
