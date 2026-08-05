import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO DO: Implement authentication logic
  res.status(200).json({ message: 'Hello from Next.js API route!' })
}