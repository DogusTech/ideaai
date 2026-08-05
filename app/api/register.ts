// Import required components
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from 'firebase-admin'

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, email, password } = req.body
    const user = await auth.createUser({ email, password })
    res.status(201).json({ message: 'Registered successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Invalid request' })
  }
}