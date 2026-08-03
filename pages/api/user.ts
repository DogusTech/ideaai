import express from 'express';
import { NextApiRequest, NextApiResponse } from 'next';

const router = express.Router();

router.get('/api/user', (req: NextApiRequest, res: NextApiResponse) => {
  // Return user data from database
  res.json({ name: 'John Doe', email: 'john.doe@example.com' });
});

export default router;
