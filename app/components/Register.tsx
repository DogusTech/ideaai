import { useState } from 'react';
import type { NextPage } from 'next';

const Register: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h1>Register</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
      <button>Register</button>
    </div>
  );
};

export default Register;