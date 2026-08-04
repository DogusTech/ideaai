// Import Firebase Firestore
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Define a reusable AI function
const ai = async (input: string) => {
  const db = getFirestore();
  const docRef = doc(db, 'ai', 'input');
  try {
    await setDoc(docRef, { input });
    console.log('AI input saved!');
  } catch (error) {
    console.error('AI input failed:', error);
  }
};

export default ai;