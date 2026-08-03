import { Link } from 'next/link';
import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';

export const Header = () => {
  return (
    <header className="bg-white/10 backdrop-blur p-4 flex justify-between items-center">
      <Link href="/ai/login">
        <a className="text-lg font-bold text-gray-800 hover:text-blue-500"><AiOutlineLogin /> Login</a>
      </Link>
      <Link href="/ai/register">
        <a className="text-lg font-bold text-gray-800 hover:text-blue-500"><AiOutlineUserAdd /> Register</a>
      </Link>
    </header>
  );
};