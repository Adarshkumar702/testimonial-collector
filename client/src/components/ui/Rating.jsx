import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Rating = ({
  value = 5,
  onChange,
  readonly = false,
  size = 'md',
  showLabel = false,
  className
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7'
  };

  const activeValue = hoverValue || value;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          className={cn(
            'transition-transform focus:outline-none',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            className={cn(
              starSizes[size],
              'transition-colors',
              star <= activeValue
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-100 text-slate-300'
            )}
          />
        </button>
      ))}
      {showLabel && (
        <span className="ml-1.5 text-sm font-semibold text-slate-700">
          {value.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};
