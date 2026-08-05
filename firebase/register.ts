import { auth, db } from './firebase/config';

export const register = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
