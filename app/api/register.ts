import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from '../firebase-admin';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;
    const user = await firebaseAdmin.auth().createUserWithEmailAndPassword(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export default register;