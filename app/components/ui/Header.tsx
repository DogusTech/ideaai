import { FC } from 'react';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

const Header: FC<Props> = ({ children }) => {
  return (
    <header className="bg-white/10 backdrop-blur p-4 flex justify-between items-center">
      <Link href="/ai">
        <a className="text-lg font-bold text-gray-800 hover:text-gray-900">TogetLink AI</a>
      </Link>
      <nav className="flex items-center space-x-4">
        <Link href="/ai/login">
          <a className="text-gray-600 hover:text-gray-800">Login</a>
        </Link>
        <Link href="/ai/register">
          <a className="text-gray-600 hover:text-gray-800">Register</a>
        </Link>
      </nav>
    </header>
  );
}

export default Header;