"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <Link href="/ai-landing-page/about">
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link href="/ai-landing-page/contact">
              <a>Contact</a>
            </Link>
          </li>
          <li>
            <Link href="/ai-landing-page/login">
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href="/ai-landing-page/signup">
              <a>Signup</a>
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link href="/ai-landing-page/dashboard">
                <a>Dashboard</a>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
