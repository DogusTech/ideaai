import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="hero">
      <h1>Welcome to TogetLink</h1>
      <motion.button whileHover={{ scale: 1.1 }}>
        Get Started
      </motion.button>
    </div>
  );
}