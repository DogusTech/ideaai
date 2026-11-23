"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import LogoSplash from './components/LogoSplash';
import { AuthProvider } from '@/lib/auth/context';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSplashDone = useCallback(() => {
    if (isMountedRef.current) {
      setSplashDone(true);
    }
  }, []);

  return (
    <>
      {!splashDone && <LogoSplash onDone={handleSplashDone} />}
      {splashDone && (
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      )}
    </>
  );
}
