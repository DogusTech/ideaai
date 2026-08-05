import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-8 xl:px-10 2xl:px-12">
      <Head>
        <title>TogetLink AI</title>
      </Head>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Welcome to TogetLink AI
      </h1>
    </div>
  );
};

export default Home;