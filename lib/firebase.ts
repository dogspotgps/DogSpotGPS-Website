
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'dogspotgps.firebaseapp.com',
  projectId: 'dogspotgps',
  storageBucket: 'dogspotgps.firebasestorage.app',
  messagingSenderId: '480897042200',
  appId: '1:480897042200:web:67db57af5fe41f73b8406d',
};

const configured = Boolean(firebaseConfig.apiKey);
const app = configured
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export { app };
export const auth    = app ? getAuth(app)      : null;
export const db      = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app)   : null;
