// Import Firebase Authentication
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Define a reusable register function
const register = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registration successful!');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

export default register;