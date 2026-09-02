import { FC } from 'react';
import Link from 'next/link';
import LoginButton from '../ui/LoginButton';
import RegisterButton from '../ui/RegisterButton';

interface Props {
  children: React.ReactNode;
}

const LoginRegister: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <LoginButton>Log in</LoginButton>
      <RegisterButton>Register</RegisterButton>
    </div>
  );
}

export default LoginRegister;
