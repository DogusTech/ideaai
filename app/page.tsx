import { AiFillHome } from 'react-icons/ai';
import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { AiOutlineRobot } from 'react-icons/ai';
import Navigation from './ui/Navigation';

const App = () => {
  return (
    <div className="h-screen bg-white/10 backdrop-blur-sm">
      <Navigation />
      <div className="p-4 space-y-4">
        <HomeIcon />
        <LoginIcon />
        <RegisterIcon />
        <AiIcon />
      </div>
    </div>
  );
};

export default App;