// AI Landing Page API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TOGETLINK AI LANDING PAGE
  res.status(200).json({ message: 'AI Landing Page' })
}