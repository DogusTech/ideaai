import { useRouter } from 'next/router';
import { AiOutlineHome } from 'react-icons/ai';

const Home = () => {
  const router = useRouter();
  return (
    <div>
      <h1>Home Page</h1>
      <p><AiOutlineHome /> Click on the icon to go back home</p>
      <button onClick={() => router.push('/')}>Go Home</button>
    </div>
  );
};

export default Home;