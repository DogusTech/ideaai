import { FC } from 'react';
import { motion } from 'framer-motion';
import { usePath } from 'next/navigation';

interface Props {}

const Register: FC<Props> = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-white/10 backdrop-blur-sm'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-lg'
      >
        <h1 className='text-3xl font-bold text-gray-900'>Register</h1>
        <form className='mt-6 space-y-4'>
          <input
            type='email'
            placeholder='Email'
            className='block w-full p-2 pl-10 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600'
          />
          <input
            type='password'
            placeholder='Password'
            className='block w-full p-2 pl-10 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600'
          />
          <input
            type='password'
            placeholder='Confirm Password'
            className='block w-full p-2 pl-10 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600'
          />
          <button
            type='submit'
            className='w-full p-2 pl-10 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg'
          >
            Register
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;