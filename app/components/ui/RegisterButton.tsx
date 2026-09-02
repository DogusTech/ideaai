import { FC } from 'react';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

const RegisterButton: FC<Props> = ({ children }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
}

export default RegisterButton;
