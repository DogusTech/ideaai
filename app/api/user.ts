import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.status(200).json({ user: docSnap.data() });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
}
