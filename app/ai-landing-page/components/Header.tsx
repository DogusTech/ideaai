import { useState } from 'react';
import Link from 'next/link';

function Header() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello World!</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <Link href="/ai">Go to AI Dashboard</Link>
    </div>
  );
}

export default Header;