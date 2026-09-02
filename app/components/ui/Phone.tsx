import { FC } from 'react';
import { AiOutlinePhone } from '@ant-design/icons';

interface Props {
  phone: string;
}

const Phone: FC<Props> = ({ phone }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlinePhone className="text-green-500" />
      <span>{phone}</span>
    </div>
  );
};

export default Phone;
