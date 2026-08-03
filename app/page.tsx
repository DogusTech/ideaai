import { NextPage } from 'next';
import Head from 'next/head';

const AIPage: NextPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Head>
        <title>TogetLink AI Landing Page</title>
      </Head>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Welcome to TogetLink AI Landing Page
      </h1>
    </div>
  );
};

export default AIPage;