import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next/auth'

const auth = getAuth();

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await createUserWithEmailAndPassword(auth, req.body.username, req.body.password);
    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
