// Import necessary libraries
import { NextApiRequest, NextApiResponse } from 'next'

// Define API endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle request and return response
    res.status(200).json({ message: 'Hello from AI!' })
}