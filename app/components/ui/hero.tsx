import { useState } from 'react';
import { Button } from '@/components/ui/Button';

function Hero() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Hero</h1>
      <p>You clicked {count} times</p>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}

export default Hero;