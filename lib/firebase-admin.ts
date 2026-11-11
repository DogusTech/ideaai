import 'server-only'
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
      try {
        return initializeApp();
      } catch (e) {
        console.error("Fallback initialization also failed.", e);
        return null;
      }
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
      try {
        return initializeApp(); // Fallback
      } catch (e) {
        console.error("Fallback initialization also failed.", e);
        return null;
      }
    }
  }
  return getApps()[0];
};

const app = createFirebaseAdminApp();
let authInstance: ReturnType<typeof getAuth> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;

export const getAdminAuth = () => {
  if (!authInstance && app) authInstance = getAuth(app);
  if (!authInstance) throw new Error("Firebase Admin Auth not initialized.");
  return authInstance;
};

export const getAdminDb = () => {
  if (!dbInstance && app) dbInstance = getFirestore(app);
  if (!dbInstance) throw new Error("Firebase Admin Db not initialized.");
  return dbInstance;
};
