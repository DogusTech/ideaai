import { NextApiRequest, NextApiResponse } from 'next';
import { Firebase } from '../firebase';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  const user = await Firebase.auth().createUserWithEmailAndPassword(email, password);
  res.status(200).json({ user });
};

export default register;