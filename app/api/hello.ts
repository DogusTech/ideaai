import { NextApiRequest, NextApiResponse } from 'next';

default export async function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ message: 'Hello from Next.js API!' });
}