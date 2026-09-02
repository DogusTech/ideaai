import { Link } from 'next/link';

export default function Nav() {
  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/ai-landing-page">AI Landing Page</Link></li>
        <li><Link href="/app">Dashboard</Link></li>
      </ul>
    </nav>
  );
}
