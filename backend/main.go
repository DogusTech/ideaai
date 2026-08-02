import express from 'express';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebase';
import { NextApiRequest, NextApiResponse } from 'next';

const app = express();

app.post('/api/login', async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    res.json({ user: userCredential.user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

app.post('/api/signup', async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.json({ user: userCredential.user });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
