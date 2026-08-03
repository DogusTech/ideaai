import { NextApiRequest, NextApiResponse } from 'next'; import firebase from 'firebase/app'; import 'firebase/auth'; import 'firebase/firestore';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
  const user = userCredential.user;
  const token = await user.getIdToken(true);
  res.json({ token });
};

export default login;
