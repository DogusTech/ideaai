import { FC } from 'react';
import Link from 'next/link';

interface Props {
  title: string;
  description: string;
}

const Hero: FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-lg text-white mb-8">{description}</p>
      <Link href="/ai">
        <a className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </a>
      </Link>
    </div>
  );
};

export default Hero;