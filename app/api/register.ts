import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '@/lib/firebase';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, password } = req.body;
    const user = await firebase.auth().createUserWithEmailAndPassword(username, password);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
}