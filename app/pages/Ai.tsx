import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export const Ai = () => {
  return (
    <div>
      <h1>Welcome to AI!</h1>
      <p>This is a Next.js app with Firebase authentication and Firestore.</p>
    </div>
  );
};