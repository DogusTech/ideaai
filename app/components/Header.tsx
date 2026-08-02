<img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
import { Link } from 'next/link';

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/ai-landing-page">AI Landing Page</Link></li>
          <li><Link href="/ai">Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
};