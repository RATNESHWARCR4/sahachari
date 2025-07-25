import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDJi_JYGLcxwFrrk-0K1m-ytl3xp9YVxME",
  authDomain: "sahachari-933da.firebaseapp.com",
  projectId:  "sahachari-933da",
  storageBucket: "sahachari-933da.firebasestorage.app",
  messagingSenderId:  "494180708819",
  appId: "1:494180708819:web:bcf6e92863dde09e8a3f26",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app; 