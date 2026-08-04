import { FC } from 'react';
import Link from 'next/link';
import Hero from '../ui/hero';

interface Props {
  title: string;
  description: string;
}

const AiPage: FC<Props> = ({ title, description }) => {
  return (
    <div className="container mx-auto p-4 pt-6">
      <Hero title={title} description={description} />
    </div>
  );
};

export default AiPage;