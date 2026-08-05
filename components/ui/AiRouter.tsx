import Link from 'next/link';
import { AiRouter } from '../components/ui/AiRouter';

const AiRouter = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/login">
        <a className="text-blue-500 hover:text-blue-700">Login</a>
      </Link>
      <Link href="/register">
        <a className="text-blue-500 hover:text-blue-700">Register</a>
      </Link>
      <Link href="/ai">
        <a className="text-blue-500 hover:text-blue-700">AI Dashboard</a>
      </Link>
    </div>
  );
};

export default AiRouter;