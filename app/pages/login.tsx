import { useState } from 'react';
import Link from 'next/link';
import { Logo } from './ui/Logo';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username, password);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur shadow-md rounded-md">
      <Logo />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="block w-full p-2 mt-2 rounded-md bg-gray-100"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full p-2 mt-2 rounded-md bg-gray-100"
        />
        <button
          type="submit"
          className="block w-full p-2 mt-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};