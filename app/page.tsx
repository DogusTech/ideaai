import { useState } from 'react';
import { GetServerSideProps } from 'next/dist/next-server/lib/utils';

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};

export default Home;