import { Firebase } from './firebase';

export class Firebase {
  private auth: any;

  constructor() {
    this.auth = firebase.initializeApp({
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
    });
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }
}