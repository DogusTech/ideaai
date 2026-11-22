import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCAnqZAPEA6-PAQNyd3IYEc39da3dU460M',
  authDomain: 'togetlink-7beaf.firebaseapp.com',
  projectId: 'togetlink-7beaf',
  // …other fields
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helper for guest sign‑in
export const signInGuest = async () => {
  await signInAnonymously(auth);
};