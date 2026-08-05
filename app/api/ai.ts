import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Ai } from '@/components/ui/Ai';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function AiPage() {
  return (
    <div>
      <Ai />
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/register">
        <a>Register</a>
      </Link>
    </div>
  );
}