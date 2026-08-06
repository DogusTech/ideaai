import { auth } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const ai = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  try {
    const user = await auth.currentUser;
    if (user) {
      res.status(200).json({ message: `Hello, ${user.email}!` });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default ai;