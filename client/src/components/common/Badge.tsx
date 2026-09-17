import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const base = 'inline-flex items-center font-medium rounded-full border';

  const variants = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    neutral: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
};
