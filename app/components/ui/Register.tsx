import { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from './firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
      <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
      <button type='submit'>Register</button>
    </form>
  );
}