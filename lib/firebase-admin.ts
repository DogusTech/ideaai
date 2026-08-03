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
      // Fallback to application default credentials if in Google Cloud environment
      return initializeApp();
    }
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return getApps()[0];
};

const app = createFirebaseAdminApp();
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
