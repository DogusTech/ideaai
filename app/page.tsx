import { NextPage } from 'next';
import Head from 'next/head';

const LandingPage: NextPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-12">
      <Head>
        <title>AI Landing Page</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">AI Landing Page</h1>
      <p className="text-lg">Welcome to the AI Landing Page</p>
    </div>
  );
};

export default LandingPage;