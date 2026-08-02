import { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <nav>
        <button onClick={() => setOpen(!open)}>
          <AiOutlineMenu size={24} />
        </button>
        <ul>{/* menu items */}</ul>
      </nav>
    </header>
  );
}