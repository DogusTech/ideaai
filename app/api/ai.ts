import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { Ai } from './ai';

const auth = getAuth();

const login = async (username, password) => {
  try {
    await signInWithEmailAndPassword(auth, username, password);
    Ai.loginSuccess();
  } catch (error) {
    Ai.loginFailure();
  }
};

const register = async (username, password) => {
  try {
    await createUserWithEmailAndPassword(auth, username, password);
    Ai.registerSuccess();
  } catch (error) {
    Ai.registerFailure();
  }
};

export { login, register };

export default auth;