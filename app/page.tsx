import { useState } from 'react';
import Link from 'next/link';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}