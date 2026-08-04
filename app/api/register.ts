import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from '../firebase-admin';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;
    const user = await firebaseAdmin.auth().createUser({ email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user' });
  }
};

export default register;