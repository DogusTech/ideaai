import { Firebase } from './firebase'

export class Firebase {
  async createUser(email: string, password: string) {
    const db = firebase.firestore()
    const userRef = db.collection('users').doc()
    await userRef.set({ email, password })
    return userRef.get()
  }
}
