import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';

function Login() {
  const [username, setUsername] = useState('');
  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;