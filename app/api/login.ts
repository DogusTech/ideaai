// Import Firebase Authentication
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Define a reusable login function
const login = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful!');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

export default login;