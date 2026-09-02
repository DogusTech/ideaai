import { FC } from 'react';
import { AiOutlineClock } from '@ant-design/icons';

interface Props {
  time: string;
}

const Clock: FC<Props> = ({ time }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineClock className="text-orange-500" />
      <span>{time}</span>
    </div>
  );
};

export default Clock;
