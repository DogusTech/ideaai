import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export { db, collection, doc, getDoc };