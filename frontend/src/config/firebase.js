// Firebase configuration for frontend
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase config object
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY || "AIzaSyBexamplekey",
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || "academy-bd619.firebaseapp.com",
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || "academy-bd619",
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || "academy-bd619.appspot.com",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VUE_APP_FIREBASE_APP_ID || "1:123456789:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
