import { Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
});

const db = getFirestore(app);

export { db };
