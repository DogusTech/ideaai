import { NextApiRequest, NextApiResponse } from 'next';
import auth from '../../backend/auth';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  try {
    const user = await auth.signInWithEmailAndPassword(email, password);
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export default login;