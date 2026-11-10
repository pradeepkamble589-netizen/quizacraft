import React from 'react';
import { Link } from 'react-router-dom';

export const NavLink = ({ to, children, active, className = '', ...props }) => (
  <Link
    to={to}
    className={`inline-block px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      active ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-900 hover:bg-emerald-100'
    } ${className}`}
    {...props}
  >
    {children}
  </Link>
);

export default NavLink;