import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  // TO DO: Implement register logic
  res.status(200).json({ message: 'Register successful' });
};

export default register;
