"use client";

import { useEffect, useState, useRef } from 'react';
import { TuraenLogo } from '@/components/brand/turaen-logo';

export default function LogoSplash({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const doneCalledRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const finish = () => {
      if (doneCalledRef.current) return;
      doneCalledRef.current = true;
      if (isMounted) {
        setShow(false);
      }
      onDone();
    };

    // Listen for window load or IPC readiness
    const timer = setTimeout(finish, 1200);

    // Hard fallback so it never stays stuck on the splash screen
    const fallbackTimer = setTimeout(finish, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [onDone]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <TuraenLogo className="h-[120px] w-[120px] text-[#FAFAFA]" />
        <span className="text-white text-lg font-medium tracking-wider">
          Turaen
        </span>
      </div>
    </div>
  );
}
