import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';

const ai = async (req: NextApiRequest, res: NextApiResponse) => {
  // TO DO: Implement AI logic
  res.status(200).json({ message: 'AI response' });
};

export default ai;