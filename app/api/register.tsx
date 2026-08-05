import { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseAuthentication } from '@/components/firebase/FirebaseAuthentication'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authentication = new FirebaseAuthentication()
  const user = await authentication.createUser(req.body)
  if (!user) {
    return res.status(400).json({
      message: 'Failed to create user',
    })
  }
  return res.status(201).json({
    message: 'User created',
  })
}
