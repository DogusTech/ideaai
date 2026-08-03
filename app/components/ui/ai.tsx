import { useState } from 'react';
import { AiFillLogin } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';
import { IoLogoGithub } from 'react-icons/io';
import { RiLoginCircleLine } from 'react-icons/ri';
import { TbLogin } from 'react-icons/tb';
import { VscLogin } from 'react-icons/vsc';

export const AiButton = () => {
  const [ai, setAi] = useState(false);
  return (
    <button onClick={() => setAi(true)}>
      <AiFillLogin size={24} />
    </button>
  );
};