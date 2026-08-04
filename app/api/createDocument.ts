import { db } from './db';
import { collection, addDoc } from 'firebase/firestore';

async function createDocument() {
  const docRef = collection(db, 'documents');
  const doc = await addDoc(docRef, {
    title: 'Hello, World!',
  });
  console.log('Document written with ID: ', doc.id);
}

createDocument();