import { FirebaseAdmin } from './firebase-admin';

class Login {
  private firebaseAdmin = new FirebaseAdmin();

  async login(req: any, res: any) {
    const auth = await this.firebaseAdmin.getAuth();
    const userCredential = await auth.signInWithEmailAndPassword(req.body.email, req.body.password);
    const user = userCredential.user;
    res.status(200).json({ message: `User ${user.email} logged in successfully` });
  }
}

export { Login };
