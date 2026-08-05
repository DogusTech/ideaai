import { NextApiRequest, NextApiResponse } from 'next-auth/auth'
import { Firebase } from './firebase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    const firebase = new Firebase()
    const user = await firebase.createUser(email, password)
    res.status(201).json({ user })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}