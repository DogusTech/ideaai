import { NextApiRequest, NextApiResponse } from 'next';
import { Firebase } from '../firebase';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  const user = await Firebase.auth().signInWithEmailAndPassword(email, password);
  res.status(200).json({ user });
};

export default login;