import { NextPage } from 'next';
import Link from 'next/link';
import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';

const LoginPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white/10 backdrop-blur-sm">
      <h1 className="text-3xl font-bold mb-4">TogetLink AI Landing Page</h1>
      <Link href="/ai/login">
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          <AiOutlineLogin /> Login
        </button>
      </Link>
      <Link href="/ai/register">
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          <AiOutlineUserAdd /> Register
        </button>
      </Link>
    </div>
  );
};

export default LoginPage;