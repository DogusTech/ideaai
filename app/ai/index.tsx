
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>TogetLink AI Dashboard</title>
      </Head>
      <h1>Welcome to TogetLink AI Dashboard</h1>
      <button onClick={() => router.push('/')}>Go to Home</button>
    </div>
  );
};