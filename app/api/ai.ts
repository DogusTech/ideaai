import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '../firebase';

const ai = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: Implement AI logic
  res.status(200).json({ message: 'AI dashboard' });
};

export default ai;