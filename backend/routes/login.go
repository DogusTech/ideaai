import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next/auth'

const auth = getAuth();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await signInWithEmailAndPassword(auth, req.body.username, req.body.password);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
