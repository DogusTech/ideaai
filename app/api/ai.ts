import { NextApiRequest, NextApiResponse } from 'next';
import { Firebase } from '../firebase';

const aiRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // TO DO: Implement AI functionality
  res.status(200).json({ message: 'AI Route' });
};

export default aiRoute;