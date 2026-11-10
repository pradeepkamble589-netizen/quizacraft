import React from 'react';

export const Heading = ({ level = 2, children, className = '', ...props }) => {
  const tags = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' };
  const Tag = tags[level] || 'h2';

  const defaultClasses = {
    1: 'text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-950 tracking-tight',
    2: 'text-2xl sm:text-3xl font-bold text-emerald-900',
    3: 'text-xl sm:text-2xl font-bold text-emerald-900',
    4: 'text-lg sm:text-xl font-bold text-emerald-800',
  };

  return (
    <Tag className={`${defaultClasses[level] || defaultClasses[2]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export const Section = ({ children, className = '', ...props }) => (
  <section className={`py-6 px-4 max-w-5xl mx-auto w-full ${className}`} {...props}>
    {children}
  </section>
);

export const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-emerald-200/80 transition-all ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Typography = { Heading, Section, Card };
export default Typography;