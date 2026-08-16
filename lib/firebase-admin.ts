import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export const createFirebaseAdminApp = () => {
  if (getApps().length === 0) {
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
      console.warn("Firebase Admin SDK credentials not found! Ensure they are set in .env");
      return initializeApp();
    }
    try {
      return initializeApp({
        credential: cert({
          projectId: serviceAccount.projectId,
          clientEmail: serviceAccount.clientEmail,
          // Handle cases where the private key might be wrapped in quotes
          privateKey: serviceAccount.privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error);
      return initializeApp(); // Fallback
    }
  }
  return getApps()[0];
};

const app = createFirebaseAdminApp();
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
