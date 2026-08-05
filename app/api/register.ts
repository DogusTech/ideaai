import { FirebaseAdmin } from './firebase-admin';

class Register {
  private firebaseAdmin = new FirebaseAdmin();

  async register(req: any, res: any) {
    const auth = await this.firebaseAdmin.getAuth();
    const userCredential = await auth.createUser(req.body.email, req.body.password);
    const user = userCredential.user;
    res.status(200).json({ message: `User ${user.email} registered successfully` });
  }
}

export { Register };
