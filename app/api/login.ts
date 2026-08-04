import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from '../firebase-admin';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;
    const user = await firebaseAdmin.auth().signInWithEmailAndPassword(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export default login;