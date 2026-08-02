import Link from 'next/link';
import LandingPage from './LandingPage';

function HomePage() {
  return (
    <div>
      <h1>TogetLink AI Home Page</h1>
      <Link href="/ai-landing-page"><a>TogetLink AI Landing Page</a></Link>
    </div>
  );
}