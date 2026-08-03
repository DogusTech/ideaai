import { FC } from 'react';
import { GeistSans } from '@/components/ui/Typography';

interface Props {
  text: string;
}

const Dashboard: FC<Props> = ({ text }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <GeistSans variant="h1" className="text-5xl text-white">
        {text}
      </GeistSans>
    </div>
  );
};

export default Dashboard;