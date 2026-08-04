import { useState } from 'react';
import type { NextPage } from 'next';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h1>Login</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
      <button>Login</button>
    </div>
  );
};

export default Login;