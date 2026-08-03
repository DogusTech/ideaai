import { NextPage } from 'next';
import Head from 'next/head';

const AiLandingPage: NextPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Head>
        <title>Ai Landing Page</title>
      </Head>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Ai Landing Page
      </h1>
    </div>
  );
};

export default AiLandingPage;