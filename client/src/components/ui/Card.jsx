import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-shadow',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('font-semibold leading-none tracking-tight text-lg text-slate-900', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-slate-500 leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
    {children}
  </div>
);
