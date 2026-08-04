import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBd3b7y4x5y6z7w9',
  authDomain: 'togetlink-ai.firebaseapp.com',
  projectId: 'togetlink-ai',
  storageBucket: 'togetlink-ai.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:1234567890',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const user = await auth.signInWithEmailAndPassword(username, password);
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        res.status(200).json({ message: 'Logged in successfully' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}