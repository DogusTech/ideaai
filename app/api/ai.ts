import { NextApiRequest, NextApiResponse } from 'next';
import * as firebase from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TO DO: Implement AI API
    res.status(200).json({ message: 'AI API' });
};