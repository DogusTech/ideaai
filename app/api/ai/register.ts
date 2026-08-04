import { firebaseAdmin } from './firebase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await firebaseAdmin.auth().createUser({
    email: req.body.email,
    password: req.body.password,
  })
  res.status(201).json({ message: `User created: ${user.uid}` })
}