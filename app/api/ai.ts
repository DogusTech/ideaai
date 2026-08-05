import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '@/lib/firebase';

export default async function ai(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req;
    const result = await firebase.firestore().collection('ai').get();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}