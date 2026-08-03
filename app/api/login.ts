import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const user = await firebase.auth().signInWithEmailAndPassword(email, password);
      res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  }
  res.status(405).json({ message: 'Method not allowed' });
}