import { FC } from 'react';
import { AiOutlineClose } from '@ant-design/icons';

interface Props {
  checked: boolean;
}

const Unchecked: FC<Props> = ({ checked }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineClose className="text-red-500" />
      <span>{checked ? 'Unchecked' : 'Checked'}</span>
    </div>
  );
};

export default Unchecked;
