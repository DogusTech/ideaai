import { NextApiRequest, NextApiResponse } from 'next';
import { loginWithEmailAndPassword } from '@/lib/firebase/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  try {
    const user = await loginWithEmailAndPassword(email, password);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid email or password' });
  }
}
