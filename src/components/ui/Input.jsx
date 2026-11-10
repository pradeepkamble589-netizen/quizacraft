import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 text-lg font-semibold bg-white/90 border-2 border-emerald-300 rounded-2xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 text-emerald-950 placeholder-emerald-400 shadow-inner transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;