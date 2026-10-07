import React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react';
import { cn } from '../../utils/cn';

export const Switch = ({ checked, onChange, label, description, disabled = false, className }) => {
  return (
    <label className={cn('flex items-center justify-between cursor-pointer group select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-slate-900 group-hover:text-brand-700 transition-colors">{label}</span>}
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      )}
      <BaseSwitch.Root
        checked={checked}
        onCheckedChange={(newChecked) => !disabled && onChange && onChange(newChecked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
          checked ? 'bg-brand-600' : 'bg-slate-300'
        )}
      >
        <BaseSwitch.Thumb
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </BaseSwitch.Root>
    </label>
  );
};
