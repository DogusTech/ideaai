import { FC } from 'react';
import { AiOutlineCheck } from '@ant-design/icons';

interface Props {
  checked: boolean;
}

const Checkbox: FC<Props> = ({ checked }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineCheck className="text-blue-500" />
      <span>{checked ? 'Checked' : 'Unchecked'}</span>
    </div>
  );
};

export default Checkbox;
