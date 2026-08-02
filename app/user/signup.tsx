import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

const auth = getAuth();

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type='submit'>Sign Up</button>
    </form>
  );
}