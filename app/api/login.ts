import { NextApiRequest, NextApiResponse } from 'next';
import { Firebase } from '../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Implement login functionality using Firebase Authentication
  const user = await Firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password);
  res.status(200).json({ user });
}