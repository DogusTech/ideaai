import { FC } from 'react';
import Link from 'next/link';
import Header from '../ui/Header';
import LoginRegister from '../ui/LoginRegister';

interface Props {
  children: React.ReactNode;
}

const Ai: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Header>
        <Link href="/ai">
          <a className="text-lg font-bold text-gray-800 hover:text-gray-900">TogetLink AI</a>
        </Link>
      </Header>
      <LoginRegister>
        {children}
      </LoginRegister>
    </div>
  );
}

export default Ai;