import { Link } from 'next/link';

export default function CTA() {
  return (
    <div className="cta">
      <h2>Get Started with TogetLink</h2>
      <Link href="/ai"><a>Learn More</a></Link>
    </div>
  );
}