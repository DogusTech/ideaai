import { NextApiRequest, NextApiResponse } from 'next'
import { firebaseConfig } from './firebase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Implement AI logic using Firebase Firestore
  res.status(200).json({ message: 'Hello from Next.js API route!' })
}