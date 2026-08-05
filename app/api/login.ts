import { NextApiRequest, NextApiResponse } from 'next'
import { firebaseConfig } from './firebase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Implement authentication logic using Firebase Authentication
  res.status(200).json({ message: 'Hello from Next.js API route!' })
}