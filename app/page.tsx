import { AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import Login from './ui/login';
import Register from './ui/register';
import Dashboard from './ui/dashboard';

function App() {
  return (
    <div>
      <Login />
      <Register />
      <Dashboard />
    </div>
  );
}