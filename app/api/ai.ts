import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = await firebase.auth().currentUser;
    if (user) {
      res.status(200).json({ message: 'AI is active' });
    } else {
      res.status(401).json({ message: 'AI is not active' });
    }
  }
  res.status(405).json({ message: 'Method not allowed' });
}