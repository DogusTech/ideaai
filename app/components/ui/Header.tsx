import { FC } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineRegister } from 'react-icons/ai';
import { AiOutlineDashboard } from 'react-icons/ai';

interface Props {}

const Header: FC<Props> = () => {
  return (
    <header className="bg-white/10 backdrop-blur-sm p-4 flex justify-between items-center">
      <nav className="flex items-center space-x-4">
        <a href="/login" className="text-lg text-gray-600 hover:text-gray-900"><AiOutlineLogin /></a>
        <a href="/register" className="text-lg text-gray-600 hover:text-gray-900"><AiOutlineRegister /></a>
        <a href="/ai" className="text-lg text-gray-600 hover:text-gray-900"><AiOutlineDashboard /></a>
      </nav>
    </header>
  );
};

export default Header;