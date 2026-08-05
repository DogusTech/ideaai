import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export { auth, db };
