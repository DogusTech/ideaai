import { useState } from 'react';
import { AiFillHome } from 'react-icons/ai';

const HomeIcon = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--card)]/10 backdrop-blur-sm">
      <AiFillHome className="text-6xl text-gray-900" />
    </div>
  );
};

export default HomeIcon;
