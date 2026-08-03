import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  // TO DO: Implement login logic
  res.status(200).json({ message: 'Login successful' });
};

export default login;