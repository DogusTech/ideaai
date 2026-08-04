import { GetServerSideProps } from 'next';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { AiIcon } from '@/components/ui/AiIcon';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function Ai() {
  return (
    <div className="flex justify-center items-center h-screen bg-white/10 backdrop-blur-sm">
      <AiIcon className="text-6xl text-blue-500" />
      <h1 className="text-3xl font-bold text-gray-900">TogetLink AI</h1>
      <Link href="/ai/login" className="text-blue-500 hover:text-blue-700">
        <a>Login</a>
      </Link>
      <Link href="/ai/register" className="text-blue-500 hover:text-blue-700">
        <a>Register</a>
      </Link>
    </div>
  );
};