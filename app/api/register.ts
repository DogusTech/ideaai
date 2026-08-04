import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../firebase/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO DO: Implement register logic
  res.status(200).json({ message: 'Register successful' });
}