
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>TogetLink AI Landing Page</title>
      </Head>
      <h1>Welcome to TogetLink AI Landing Page</h1>
      <button onClick={() => router.push('/ai')}>Go to Dashboard</button>
    </div>
  );
};