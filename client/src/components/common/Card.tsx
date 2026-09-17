import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-200';

  const variants = {
    default:
      'bg-white dark:bg-[#111827] border-gray-200 dark:border-[#1F2937] text-gray-900 dark:text-gray-100 shadow-sm',
    elevated:
      'bg-white dark:bg-[#111827] border-gray-200 dark:border-[#1F2937] text-gray-900 dark:text-gray-100 shadow-md hover:shadow-lg',
    glass:
      'bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-gray-200/50 dark:border-gray-800/60 shadow-lg',
    interactive:
      'bg-white dark:bg-[#111827] border-gray-200 dark:border-[#1F2937] hover:border-brand-500/50 hover:shadow-md cursor-pointer active:scale-[0.995]',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
