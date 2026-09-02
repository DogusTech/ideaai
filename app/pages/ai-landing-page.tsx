import { FC } from 'react';
import Link from 'next/link';
import Header from '../ui/Header';
import Ai from './Ai';

interface Props {
  children: React.ReactNode;
}

const AiLandingPage: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Header>
        <Link href="/app">
          <a className="text-lg font-bold text-gray-800 hover:text-gray-900">TogetLink AI</a>
        </Link>
      </Header>
      <Ai>
        {children}
      </Ai>
    </div>
  );
}

export default AiLandingPage;
