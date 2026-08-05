import { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseAuthentication } from '@/components/firebase/FirebaseAuthentication'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authentication = new FirebaseAuthentication()
  const user = await authentication.verifyIdToken(req.headers.authorization)
  if (!user) {
    return res.status(401).json({
      message: 'Unauthorized',
    })
  }
  return res.status(200).json({
    message: 'Authorized',
  })
}
