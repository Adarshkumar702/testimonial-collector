import React from 'react';
import { cn } from '../../utils/cn';

export const MasonryGrid = ({ children, columns = 3, className }) => {
  return (
    <div
      className={cn(
        'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6',
        className
      )}
    >
      {React.Children.map(children, (child) => (
        <div className="break-inside-avoid">{child}</div>
      ))}
    </div>
  );
};
