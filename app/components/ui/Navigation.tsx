import { AiOutlineHome } from 'react-icons/ai';
import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { AiOutlineRobot } from 'react-icons/ai';

const Navigation = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm">
      <ul className="flex items-center space-x-4">
        <li><AiOutlineHome /></li>
        <li><AiOutlineLogin /></li>
        <li><AiOutlineUserAdd /></li>
        <li><AiOutlineRobot /></li>
      </ul>
    </nav>
  );
};

export default Navigation;
