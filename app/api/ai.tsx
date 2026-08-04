import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO DO: Implement AI functionality
  res.status(200).json({ message: 'AI functionality not implemented yet.' });
}