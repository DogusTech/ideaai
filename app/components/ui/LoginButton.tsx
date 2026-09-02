import { FC } from 'react';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

const LoginButton: FC<Props> = ({ children }) => {
  return (
    <button
      className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
}

export default LoginButton;
