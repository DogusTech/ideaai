import { FC } from 'react';
import { AiOutlineUser } from '@ant-design/icons';

interface Props {
  username: string;
}

const Username: FC<Props> = ({ username }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineUser className="text-red-500" />
      <span>{username}</span>
    </div>
  );
};

export default Username;
