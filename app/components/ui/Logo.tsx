import { FC } from 'react';
import { motion } from 'framer-motion';
import { usePath } from 'next/navigation';

interface Props {}

const Logo: FC<Props> = () => {
  const path = usePath();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='flex justify-center items-center text-4xl font-bold text-white'
    >
      <img src="https://source.unsplash.com/800x600/?corporate,office,technology" />
    </motion.div>
  );
};

export default Logo;