"use client";

import { FC } from 'react';
import { useAuth } from '@/lib/auth/context';
import Link from 'next/link';

const HomePage: FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to TogetLink</h1>
      
      {user ? (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-lg">Logged in as: {user.email}</p>
          <Link 
            href="/ai"
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Go to AI Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link 
            href="/ai-landing-page/login"
            className="px-6 py-2 border border-black text-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/ai-landing-page/register"
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;