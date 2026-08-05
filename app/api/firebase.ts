import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: "<MESSAGING_SENDER_ID>",
  appId: "<APP_ID>",
  measurementId: "<MEASUREMENT_ID>",
};

firebase.initializeApp(firebaseConfig);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add your API route logic here
  res.status(200).json({ message: 'Hello from Next.js!' });
}