import { FC } from 'react';
import { useSession } from 'next-auth/react';

interface Props {}

const LoginRegisterButton: FC<Props> = () => {
  const { data: session } = useSession();
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {session ? "Dashboard" : "Login/Register"}
    </button>
  );
};

export default LoginRegisterButton;
