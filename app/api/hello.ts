import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Firebase } from './firebase';

const db = getFirestore(Firebase);

export async function getHello() {
  const helloCollection = collection(db, 'hello');
  const helloDocs = await getDocs(helloCollection);
  return helloDocs;
}