import { Firebase } from '../firebase';

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-white/10 backdrop-blur">
      <form className="bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <input type="email" placeholder="Email" className="block w-full p-2 mb-4" />
        <input type="password" placeholder="Password" className="block w-full p-2 mb-4" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
      </form>
    </div>
  );
}