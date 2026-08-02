import Link from 'next/link';
import Image from 'next/image';

function Home() {
  return (
    <div className="container">
      <h1>Welcome to TogetLink!</h1>
      <p>This is an AI-powered landing page.</p>
      <Link href="/ai">
        <a>Go to AI Dashboard</a>
      </Link>
      <Image
        src="https://source.unsplash.com/800x600/?corporate,office,technology"
        alt="TogetLink AI Landing Page"
        width={800}
        height={600}
      />
    </div>
  );
}

export default Home;