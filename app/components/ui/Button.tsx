// Import Framer Motion
import { motion } from 'framer-motion';

// Define a reusable Button component
const Button = () => {
  return (
    <motion.button
      initial={{ scale: 0.5 }}
      whileHover={{ scale: 1 }}
      className='bg-white/10 backdrop-blur hover:bg-white/20 transition duration-300'
    >
      Click me!
    </motion.button>
  );
};

export default Button;