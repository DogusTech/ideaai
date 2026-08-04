import { Header } from './header';

export const Login = () => {
  return <div className="container mx-auto p-4">
    <Header />
    <form className="max-w-md mx-auto p-4 bg-white/10 backdrop-blur rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Login</h2>
      <input type="email" placeholder="Email" className="block w-full p-2 mb-4" />
      <input type="password" placeholder="Password" className="block w-full p-2 mb-4" />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
    </form>
  </div>;
};