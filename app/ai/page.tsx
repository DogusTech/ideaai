import Link from 'next/link';

export default function Ai() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-xl border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Welcome to TogetLink AI Dashboard!</h1>
        <p className="text-slate-500 mb-8">This is a Next.js App Router project managed entirely by our 24/7 autonomous AI.</p>
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}