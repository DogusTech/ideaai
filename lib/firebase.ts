import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAnqZAPEA6-PAQNyd3IYEc39da3dU460M",
  authDomain: "togetlink-7beaf.firebaseapp.com",
  projectId: "togetlink-7beaf",
  storageBucket: "togetlink-7beaf.firebasestorage.app",
  messagingSenderId: "49036602621",
  appId: "1:49036602621:web:8764308bb34f38b8422294",
  measurementId: "G-K2RS6MTPKN"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
