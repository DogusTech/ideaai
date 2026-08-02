import { auth } from './firebase';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  // Authenticate user
  const user = await auth.signInWithEmailAndPassword(username, password);
  res.status(200).json({ message: 'User authenticated successfully' });
}