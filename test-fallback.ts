import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

try {
    const app = initializeApp();
    console.log("App initialized");
    const auth = getAuth(app);
    console.log("Auth initialized");
    const db = getFirestore(app);
    console.log("Firestore initialized");
} catch(e) {
    console.error("Initialization failed:", e);
}
