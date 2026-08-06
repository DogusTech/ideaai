import Link from 'next/link';
import { Ai } from '@/components/ui/Ai';

const AiPage = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">AI Landing Page</h1>
      <Ai />
      <Link href="/login">
        <a className="text-blue-500 hover:text-blue-700">Login</a>
      </Link>
      <Link href="/register">
        <a className="text-blue-500 hover:text-blue-700">Register</a>
      </Link>
    </div>
  );
};

export default AiPage;