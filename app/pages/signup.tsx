import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';

function Signup() {
  const [username, setUsername] = useState('');
  return (
    <div>
      <h1>Signup</h1>
      <form>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button>Signup</button>
      </form>
    </div>
  );
}

export default Signup;