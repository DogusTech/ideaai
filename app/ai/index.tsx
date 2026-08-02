import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `TogetLink | ${count}`;
  }, [count]);

  return (
    <div>
      <h1>TogetLink</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <Link href="/ai"><a>Go to AI</a></Link>
    </div>
  );
}