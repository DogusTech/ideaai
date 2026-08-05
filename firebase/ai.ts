import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function getAiData() {
  const aiCollectionRef = collection(db, 'ai');
  const aiSnap = await getDocs(aiCollectionRef);
  return aiSnap.docs;
}
