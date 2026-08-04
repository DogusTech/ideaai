import { NextPage } from 'next';
import Head from 'next/head';

const AiLandingPage: NextPage = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-8 xl:px-10 2xl:px-12">
      <Head>
        <title>TogetLink AI Landing Page</title>
      </Head>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        TogetLink AI Landing Page
      </h1>
      <p className="text-lg font-medium leading-relaxed text-gray-500">
        Welcome to TogetLink AI Landing Page
      </p>
    </div>
  );
};

export default AiLandingPage;