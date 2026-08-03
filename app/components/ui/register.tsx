import { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { IoLogoGithub } from 'react-icons/io';
import { RiLoginCircleLine } from 'react-icons/ri';
import { TbLogin } from 'react-icons/tb';
import { VscLogin } from 'react-icons/vsc';

export const RegisterButton = () => {
  const [register, setRegister] = useState(false);
  return (
    <button onClick={() => setRegister(true)}>
      <FiLogIn size={24} />
    </button>
  );
};