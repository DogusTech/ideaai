import { Link } from 'next/link';
import { AiOutlineRegister } from 'react-icons/ai';

export default function Register() {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <p className="text-gray-600 mb-4">Welcome to TogetLink!</p>
      <Link href="/app">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <AiOutlineRegister /> Register
        </a>
      </Link>
    </div>
  );
}
