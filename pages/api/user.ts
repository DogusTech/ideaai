import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Return user data from database
  res.status(200).json({ name: 'John Doe', email: 'john.doe@example.com' });
}
