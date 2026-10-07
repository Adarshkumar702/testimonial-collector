import React from 'react';
import { Button } from './Button';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no items matching your criteria at the moment.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 text-brand-600 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm text-slate-500 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};
