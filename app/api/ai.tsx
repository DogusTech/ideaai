import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@google-cloud/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

const db = getFirestore(app);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const snapshot = await db.collection('ai').get();
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching AI data' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}