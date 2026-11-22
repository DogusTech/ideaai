"use client";

import { useEffect, useState } from 'react';
import { TuraenLogo } from '@/components/brand/turaen-logo';

export default function LogoSplash({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onDone();
    }, 2000); // splash duration 2s
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <TuraenLogo className="h-[120px] w-[120px] text-[#FAFAFA]" />
        <span className="text-white text-lg font-medium tracking-wider">
          Turaen
        </span>
      </div>
    </div>
  );
}
