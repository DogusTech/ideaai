import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next/auth'

const auth = getAuth();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      res.status(200).json({ message: 'Signed in successfully' });
    } catch (error) {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  }
}