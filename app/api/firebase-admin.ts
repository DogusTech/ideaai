import { FirebaseAdmin } from './firebase-admin';

class FirebaseAdmin {
  private firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
  };

  async initializeApp() {
    return await firebase.initializeApp(this.firebaseConfig);
  }

  async getAuth() {
    return await this.initializeApp().getAuth();
  }

  async getFirestore() {
    return await this.initializeApp().firestore();
  }

  async getUser() {
    const auth = await this.getAuth();
    return await auth.currentUser;
  }
}

export { FirebaseAdmin };
