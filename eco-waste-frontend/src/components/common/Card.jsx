import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  gradient = false,
  hover = true,
  className = '',
  ...props 
}) => {
  const baseClasses = gradient 
    ? 'bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6'
    : 'bg-white rounded-2xl shadow-lg p-6';
  
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {(title || icon) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {icon && <span className="text-2xl">{icon}</span>}
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
