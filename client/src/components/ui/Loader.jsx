import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Loader = ({ label = 'Loading...', className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 gap-3', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      {label && <p className="text-sm font-medium text-slate-500">{label}</p>}
    </div>
  );
};
