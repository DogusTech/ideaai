import { FC } from 'react';
import { AiOutlineLock } from '@ant-design/icons';

interface Props {
  password: string;
}

const Password: FC<Props> = ({ password }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineLock className="text-blue-500" />
      <span>{password}</span>
    </div>
  );
};

export default Password;
