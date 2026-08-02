<img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
import Link from 'next/link';

export default function GitHub() {
  return (
    <div>
      <h1>GitHub Integration</h1>
      <Link href="/github/repositories">
        <a>Go to Repositories</a>
      </Link>
    </div>
  );
};