import { FC } from 'react';
import { AiOutlineCalendar } from '@ant-design/icons';

interface Props {
  date: string;
}

const Date: FC<Props> = ({ date }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineCalendar className="text-purple-500" />
      <span>{date}</span>
    </div>
  );
};

export default Date;
