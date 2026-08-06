import { NextApiRequest, NextApiResponse } from 'next/api-handler';
import { firebaseAdmin } from '../firebase-admin';
import { firestore } from '../firebase-admin';
import { Ai } from '../components/Ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const user = await firebaseAdmin.auth().getUser(req.body.uid);
    const userDoc = await firestore.collection('users').doc(user.uid).get();
    const userRef = userDoc.ref;
    const userDocData = userDoc.data();

    res.status(200).json({
      user: userDocData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}
