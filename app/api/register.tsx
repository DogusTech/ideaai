import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  // TO DO: Implement register logic
  res.status(200).json({ message: 'Registration successful' });
};

export default register;