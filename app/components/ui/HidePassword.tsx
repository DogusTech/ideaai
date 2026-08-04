import { FC } from 'react';
import { AiOutlineEyeInvisible } from '@ant-design/icons';

interface Props {
  showPassword: boolean;
}

const HidePassword: FC<Props> = ({ showPassword }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineEyeInvisible className="text-red-500" />
      <span>{showPassword ? 'Hide' : 'Show'}</span>
    </div>
  );
};

export default HidePassword;