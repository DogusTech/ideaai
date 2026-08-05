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
    <div>
      <h1>Ai Dashboard</h1>
      <Link href="/login"><a>Login</a></Link>
      <Link href="/register"><a>Register</a></Link>
      <AiIcon/>
    </div>
  );
}