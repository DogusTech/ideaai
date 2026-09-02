import { FC } from 'react';
import { AiOutlineEye } from '@ant-design/icons';

interface Props {
  showPassword: boolean;
}

const ShowPassword: FC<Props> = ({ showPassword }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineEye className="text-green-500" />
      <span>{showPassword ? 'Show' : 'Hide'}</span>
    </div>
  );
};

export default ShowPassword;
