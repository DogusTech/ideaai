import { NextApiRequest, NextApiResponse } from 'next'
import { firebaseConfig } from '@/components/firebase'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      res.status(200).json({ message: 'Logged in successfully' })
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } else if (req.method === 'POST' && req.body.action === 'register') {
    const { email, password } = req.body
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
      res.status(400).json({ message: 'Invalid request' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}