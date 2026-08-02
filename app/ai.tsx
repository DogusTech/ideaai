<img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
import Link from 'next/link';

export default function AI() {
  return (
    <div>
      <h1>AI Dashboard</h1>
      <Link href="/ai/dashboard">
        <a>Go to Dashboard</a>
      </Link>
    </div>
  );
};