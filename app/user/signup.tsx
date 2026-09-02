<!-- User signup component -->
import { useState } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h1>Signup</h1>
      <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
      <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'/>
      <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
      <button>Signup</button>
    </div>
  );
}

export default Signup;
