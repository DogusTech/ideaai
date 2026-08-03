<!-- AI Landing Page -->
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TOGETLINK AI LANDING PAGE
  res.status(200).json({ message: 'Welcome to TogetLink AI Landing Page!' })
}
