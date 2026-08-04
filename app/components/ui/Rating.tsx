import { FC } from 'react';
import { AiFillStar } from '@ant-design/icons';

interface Props {
  rating: number;
}

const Rating: FC<Props> = ({ rating }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiFillStar className="text-yellow-500" />
      <span>{rating}</span>
    </div>
  );
};

export default Rating;