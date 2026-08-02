import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';

function Header() {
  const [username, setUsername] = useState('');
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/ai-landing-page">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/ai">
              <a>Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href="/signup">
              <a>Signup</a>
            </Link>
          </li>
          <li>
            <button onClick={() => setUsername('John Doe')}>Login as John Doe</button>
          </li>
          <li>
            <p>Username: {username}</p>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;