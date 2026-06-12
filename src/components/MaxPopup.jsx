import React from 'react';
import { motion } from 'framer-motion';

const MaxPopup = ({ onClose }) => (
  <div className="max-popup-overlay" onClick={onClose}>
    <motion.div 
      className="max-popup-content" 
      initial={{ scale: 0.8, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      exit={{ scale: 0.8, opacity: 0 }} 
      transition={{ type: "spring", bounce: 0.3 }}
      onClick={(e) => e.stopPropagation()}
    >
      <img src="https://r2.diverlin.ru/Assets/max_final.webp" alt="Max" className="max-popup-img" />
    </motion.div>
  </div>
);

export default MaxPopup;
