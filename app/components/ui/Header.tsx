import { FC } from 'react';
import { useSession } from 'next-auth/react';

interface Props {}

const Header: FC<Props> = () => {
  const { data: session } = useSession();
  return (
    <header className="bg-white/10 backdrop-blur-sm p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">TogetLink</h1>
      {session ? (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Dashboard
        </button>
      ) : (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login/Register
        </button>
      )}
    </header>
  );
};

export default Header;