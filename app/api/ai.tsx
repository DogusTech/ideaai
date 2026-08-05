import { useState } from 'react';
import { Layout } from './ui/Layout';

export default function Dashboard() {
  const [count, setCount] = useState(0);

  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </Layout>
  );
}