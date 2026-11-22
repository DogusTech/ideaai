"use client";
import { useState } from 'react';
import LogoSplash from './components/LogoSplash';
import { AuthProvider } from '@/lib/auth/context';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  return (
    <>
      {!splashDone && <LogoSplash onDone={() => setSplashDone(true)} />}
      {splashDone && (
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      )}
    </>
  );
}
