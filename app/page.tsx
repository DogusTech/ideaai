import { useState } from 'react';
import Link from 'next/link';

export default function AiLandingPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TO DO: Implement login logic
  };

  const handleRegister = () => {
    // TO DO: Implement register logic
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">TogetLink AI Landing Page</h1>
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur shadow-md rounded-lg">
        <form className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="p-2 pl-10 text-sm text-gray-700 bg-gray-100 rounded-lg"
            />
            <button
              type="button"
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-2 pl-10 text-sm text-gray-700 bg-gray-100 rounded-lg"
            />
            <button
              type="button"
              onClick={handleRegister}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}