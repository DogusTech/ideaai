import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [active, setActive] = useState(false);

  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/ai-landing-page"><a>Home</a></Link></li>
          <li><Link href="/ai"><a>About</a></Link></li>
        </ul>
      </nav>
    </header>
  );
}