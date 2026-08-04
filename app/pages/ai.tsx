import { FC } from 'react';
import Link from 'next/link';
import Header from '../ui/Header';

interface Props {
  children: React.ReactNode;
}

const AI: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Header>
        <Link href="/ai">
          <a className="text-lg font-bold text-gray-800 hover:text-gray-900">TogetLink AI</a>
        </Link>
      </Header>
      <main className="flex flex-col items-center space-y-4 p-4">
        {children}
      </main>
    </div>
  );
}

export default AI;