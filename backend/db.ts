import { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import initFirebase from './firebase';

default function initFirestore() {
	const app = initFirebase();
	const db = getFirestore(app);
	return db;
}