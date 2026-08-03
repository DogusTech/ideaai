import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';

export const LoginButton = () => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <Link href="/ai/login"><a><AiOutlineLogin /> Login</a></Link>
    </button>
  );
};