import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAozBBvxswOapfcm8E19PKn1CoBcQbi77I",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "togetlink-7beaf.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "togetlink-7beaf",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "togetlink-7beaf.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "49036602621",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:49036602621:web:8764308bb34f38b8422294",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
try {
  auth = getAuth(app);
} catch {
  auth = {} as Auth;
}

const db = getFirestore(app);

export { app, auth, db };
