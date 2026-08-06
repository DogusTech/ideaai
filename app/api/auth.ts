import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO DO: Implement authentication functionality
  res.status(200).json({ message: 'Hello Authentication!' })
}