// TO DO: Implement authentication logic using Firebase Authentication and Firestore
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
}

firebase.initializeApp(firebaseConfig)

export default firebase