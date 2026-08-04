import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';

export default function Ai() {
  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">AI</h2>
      <p>This is the AI page.</p>
    </div>
  );
}