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
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a>Contact</a>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <a>Signup</a>
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link href="/app">
                <a>Dashboard</a>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
