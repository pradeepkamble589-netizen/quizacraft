import React from 'react';
import { playClickSound } from '../../utils/audio';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  sound = true,
  icon,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    if (sound) {
      playClickSound();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-bold select-none cursor-pointer rounded-2xl transition-all duration-150 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5 shadow-sm',
    md: 'px-5 py-2.5 text-base gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0.5',
    lg: 'px-7 py-3.5 text-lg gap-2.5 shadow-lg hover:-translate-y-1 active:translate-y-0.5',
    xl: 'px-8 py-4 text-xl font-extrabold gap-3 shadow-xl hover:-translate-y-1 active:translate-y-1',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-b from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-b-4 border-green-800 focus:ring-green-300 active:border-b-0 active:mt-1',
    accent: 'bg-gradient-to-b from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-amber-950 border-b-4 border-amber-700 focus:ring-amber-200 active:border-b-0 active:mt-1',
    orange: 'bg-gradient-to-b from-orange-400 to-amber-600 hover:from-orange-300 hover:to-amber-500 text-white border-b-4 border-orange-800 focus:ring-orange-300 active:border-b-0 active:mt-1',
    secondary: 'bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-300 border-b-4 border-b-emerald-400 focus:ring-emerald-200 active:border-b-2 active:mt-0.5',
    outline: 'bg-white/80 backdrop-blur-sm hover:bg-white text-emerald-900 border-2 border-emerald-300 hover:border-emerald-500 focus:ring-emerald-200',
    glass: 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/40 focus:ring-white/30',
    danger: 'bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white border-b-4 border-red-800 focus:ring-red-200 active:border-b-0 active:mt-1',
    correct: 'bg-gradient-to-b from-emerald-500 to-green-600 text-white border-b-4 border-green-800 shadow-green-200',
    wrong: 'bg-gradient-to-b from-rose-500 to-red-600 text-white border-b-4 border-red-800 shadow-red-200',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;