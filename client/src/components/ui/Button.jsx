import React from 'react';
import { Button as BaseButton } from '@base-ui/react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-sm',
  secondary: 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-700 shadow-sm',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-brand-500',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-medium rounded-lg gap-2.5'
};

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  icon: Icon,
  type = 'button',
  ...props
}, ref) => {
  return (
    <BaseButton
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </BaseButton>
  );
});

Button.displayName = 'Button';
