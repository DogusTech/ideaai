import { auth } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  try {
    const user = await auth.createUserWithEmailAndPassword(email, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Email already in use' });
  }
};

export default register;