import { firebaseAdmin } from './firebase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await firebaseAdmin.auth().getUser(req.body.userId)
  res.status(200).json({ message: `Hello, ${user.displayName}!` })
}