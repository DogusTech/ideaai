import Link from 'next/link';
import Image from '../ui/image';

export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Welcome to TogetLink!
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-gray-500">
        Your AI-powered landing page.
      </p>
      <div className="mt-4 flex justify-center">
        <Link href="/ai">
          <a
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Image src="https://source.unsplash.com/800x600/?corporate,office,technology" />
          </a>
        </Link>
      </div>
    </div>
  );
}