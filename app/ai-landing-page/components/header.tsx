import React from 'react';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>TogetLink AI Landing Page</h1>
    </motion.div>
  );
};