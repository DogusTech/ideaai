import { Firebase } from './firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Implement AI landing page login and register functionality using Firebase Authentication
  const firebase = new Firebase();
  if (req.method === 'POST') {
    if (req.body.action === 'login') {
      const user = await firebase.signInWithEmailAndPassword(req.body.email, req.body.password);
      res.status(200).json({ user });
    } else if (req.body.action === 'register') {
      const user = await firebase.createUserWithEmailAndPassword(req.body.email, req.body.password);
      res.status(200).json({ user });
    }
  }
  res.status(405).json({ error: 'Method not allowed' });
}