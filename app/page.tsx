import { NextPage } from 'next';
import Head from 'next/head';

const AIPage: NextPage = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-8 xl:px-12 2xl:px-16 max-w-screen-2xl">
      <Head>
        <title>TogetLink AI Landing Page</title>
      </Head>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        TogetLink AI Landing Page
      </h1>
    </div>
  );
}