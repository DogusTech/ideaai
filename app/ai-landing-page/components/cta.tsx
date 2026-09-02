import { Link } from 'next/link';

export default function CTA() {
  return (
    <div className="cta">
      <h2>Get Started with TogetLink</h2>
      <Link href="/app"><a>Learn More</a></Link>
    </div>
  );
}
