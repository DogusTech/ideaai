import { AppRouter } from '@vercel/static-next-app';
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div>
      <h1>AI Landing Page</h1>
      <img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
    </div>
  );
};

export default Home;
