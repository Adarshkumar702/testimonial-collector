import React from 'react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200/80',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200/80',
  archived: 'bg-slate-100 text-slate-700 border-slate-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  outline: 'bg-transparent text-slate-700 border-slate-300'
};

export const Badge = ({ children, variant = 'pending', className, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors',
        badgeVariants[variant] || badgeVariants.outline,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
