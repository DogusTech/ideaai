// Import required components
import { NextApiRequest, NextApiResponse } from 'next'

export default async function dashboard(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'AI Dashboard' })
}