import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [active, setActive] = useState(false);

  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/app"><a>AI Dashboard</a></Link></li>
          <li><Link href="/ai/login"><a>Login</a></Link></li>
          <li><Link href="/ai/signup"><a>Signup</a></Link></li>
        </ul>
      </nav>
    </header>
  );
}
