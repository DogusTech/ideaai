// TOGETLINK DASHBOARD API ROUTE
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TOGETLINK DASHBOARD LOGIC WILL GO HERE
    res.status(200).json({ message: 'Dashboard' })
}