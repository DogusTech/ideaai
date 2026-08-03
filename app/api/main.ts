import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@google-cloud/firestore';

const db = new Firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // API route implementation
  res.status(200).json({ message: 'Hello, World!' });
}