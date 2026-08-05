import { NextApiRequest, NextApiResponse } from 'next';
import { FirebaseAdmin } from '../firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Implement register logic here
  res.status(200).json({ message: 'Register endpoint working' });
}