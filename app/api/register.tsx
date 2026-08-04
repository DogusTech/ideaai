import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO DO: Implement Register API
  res.status(200).json({ message: 'Register API' });
}