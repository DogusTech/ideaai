import { FC } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineRegister } from 'react-icons/ai';
import { AiOutlineDashboard } from 'react-icons/ai';

interface Props {}

const Login: FC<Props> = () => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
      <h2 className="text-lg text-gray-600 font-bold mb-4">Login</h2>
      <form className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="text-lg text-gray-600" htmlFor="email">Email</label>
          <input type="email" id="email" className="py-2 px-4 rounded-lg bg-gray-100 text-lg text-gray-600" placeholder="john.doe@example.com" />
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-lg text-gray-600" htmlFor="password">Password</label>
          <input type="password" id="password" className="py-2 px-4 rounded-lg bg-gray-100 text-lg text-gray-600" placeholder="********" />
        </div>
        <button className="py-2 px-4 rounded-lg bg-blue-500 text-lg text-white hover:bg-blue-700" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;