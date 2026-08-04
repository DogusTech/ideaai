import { NextPage } from 'next';
import Head from 'next/head';

const AiLandingPage: NextPage = () => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
      <Head>
        <title>TogetLink AI Landing Page</title>
      </Head>
      <h1 className="text-3xl font-bold text-gray-900">TogetLink AI</h1>
      <p className="text-lg text-gray-600">Welcome to the TogetLink AI landing page!</p>
    </div>
  );
}