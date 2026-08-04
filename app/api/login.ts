import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../firebase/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO DO: Implement login logic
  res.status(200).json({ message: 'Login successful' });
}