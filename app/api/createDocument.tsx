import { Router } from 'next/router';
import { createDocument } from './createDocument';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await createDocument();
    res.status(201).json({ message: 'Document created' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}