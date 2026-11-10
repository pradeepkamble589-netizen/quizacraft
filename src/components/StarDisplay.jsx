import React, { useEffect, useState } from 'react';

export const StarDisplay = ({ stars = 0, maxStars = 5, size = 'md', animated = true }) => {
  const [prevStars, setPrevStars] = useState(stars);
  const [poppingIndex, setPoppingIndex] = useState(null);

  useEffect(() => {
    if (stars > prevStars) {
      setPoppingIndex(stars - 1);
      const timer = setTimeout(() => setPoppingIndex(null), 800);
      return () => clearTimeout(timer);
    }
    setPrevStars(stars);
  }, [stars, prevStars]);

  const sizeClasses = {
    sm: 'text-base gap-1',
    md: 'text-xl sm:text-2xl gap-1.5',
    lg: 'text-3xl sm:text-4xl gap-2',
  };

  return (
    <div className={`inline-flex items-center select-none ${sizeClasses[size] || sizeClasses.md}`} aria-label={`${stars} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        const isPopping = animated && poppingIndex === index;

        return (
          <span
            key={index}
            className={`inline-block transition-transform duration-300 ${
              isFilled ? 'text-amber-400 drop-shadow-md' : 'text-emerald-900/30 grayscale opacity-40'
            } ${isPopping ? 'animate-star-pop scale-150' : 'hover:scale-110'}`}
          >
            ⭐
          </span>
        );
      })}
    </div>
  );
};

export default StarDisplay;
