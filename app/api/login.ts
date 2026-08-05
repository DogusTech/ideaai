import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '@/lib/firebase';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, password } = req.body;
    const user = await firebase.auth().signInWithEmailAndPassword(username, password);
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}