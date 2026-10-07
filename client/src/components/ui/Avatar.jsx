import React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react';
import { cn } from '../../utils/cn';

export const Avatar = ({ src, alt = 'Avatar', size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <BaseAvatar.Root
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-semibold text-slate-700 shadow-inner border border-slate-200 select-none',
        sizeClasses[size],
        className
      )}
    >
      {src && (
        <BaseAvatar.Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      )}
      <BaseAvatar.Fallback className="flex h-full w-full items-center justify-center font-semibold text-slate-700">
        {getInitials(alt)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
};
