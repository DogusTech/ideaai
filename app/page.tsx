import { FC } from 'react';
import Link from 'next/link';
import Login from '../pages/login';
import Register from '../pages/register';

interface Props {
  children: React.ReactNode;
}

const AppRouter: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Link href="/ai/login">
        <a className="text-lg font-bold text-gray-800 hover:text-gray-900">Login</a>
      </Link>
      <Link href="/ai/register">
        <a className="text-lg font-bold text-gray-800 hover:text-gray-900">Register</a>
      </Link>
      <div className="flex flex-col items-center space-y-4 p-4">
        {children}
      </div>
    </div>
  );
}

export default AppRouter;