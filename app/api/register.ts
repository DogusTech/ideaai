import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '../firebase';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password } = req.body;
  try {
    const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await user.updateProfile({ displayName: name });
    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid email or password' });
  }
};

export default register;