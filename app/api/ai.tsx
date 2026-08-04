import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      const user = await firebase.auth().signInWithEmailAndPassword(username, password);
      res.status(200).json({ message: 'User signed in successfully.' });
    } catch (error) {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } else if (req.method === 'GET') {
    try {
      const user = await firebase.auth().currentUser;
      if (user) {
        res.status(200).json({ message: 'User is signed in.' });
      } else {
        res.status(401).json({ message: 'User is not signed in.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking user status.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}