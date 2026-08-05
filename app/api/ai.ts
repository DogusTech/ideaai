import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map((doc) => doc.data());
  res.json(users);
}