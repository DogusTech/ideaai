import { FC } from 'react';
import { AiOutlineMail } from '@ant-design/icons';

interface Props {
  email: string;
}

const Email: FC<Props> = ({ email }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
      <AiOutlineMail className="text-blue-500" />
      <span>{email}</span>
    </div>
  );
};

export default Email;