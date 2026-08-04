import { auth } from './init';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(auth);

export default db;