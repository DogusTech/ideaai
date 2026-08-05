// Import required components
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from 'firebase-admin'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, password } = req.body
    const user = await auth.signInWithEmailAndPassword(username, password)
    res.status(200).json({ message: 'Logged in successfully' })
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}