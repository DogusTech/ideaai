import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebase = initializeApp({
  apiKey: 'API_KEY',
  authDomain: 'AUTH_DOMAIN',
  projectId: 'PROJECT_ID',
  storageBucket: 'STORAGE_BUCKET',
  messagingSenderId: 'MESSAGING_SENDER_ID',
  appId: 'APP_ID',
});

const db = getFirestore(firebase);

export { firebase, db };
