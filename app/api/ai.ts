import { NextApiRequest, NextApiResponse } from 'next';
import { FirebaseAdmin } from './firebase-admin';

const firebaseAdmin = new FirebaseAdmin();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO DO: Implement AI endpoint
  res.status(200).json({ message: 'AI endpoint not implemented' });
}