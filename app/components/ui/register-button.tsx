import { AiOutlineUserAdd } from 'react-icons/ai';
import { AiOutlineLogout } from 'react-icons/ai';

export const RegisterButton = () => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <Link href="/ai/register"><a><AiOutlineUserAdd /> Register</a></Link>
    </button>
  );
};
