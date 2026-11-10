import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-emerald-200/80 transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;