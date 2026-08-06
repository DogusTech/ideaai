import { NextApiRequest, NextApiResponse } from 'next';
import { Firebase } from '../firebase';

const ai = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: 'AI is working...' });
};

export default ai;