import React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react';
import { cn } from '../../utils/cn';

export const Tabs = ({ tabs = [], activeTab, onChange, className }) => {
  return (
    <BaseTabs.Root value={activeTab} onValueChange={(val) => onChange && onChange(val)}>
      <BaseTabs.List className={cn('flex items-center space-x-1 border-b border-slate-200 overflow-x-auto', className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <BaseTabs.Tab
              key={tab.id}
              value={tab.id}
              onClick={() => onChange && onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap focus:outline-none cursor-pointer select-none',
                isActive
                  ? 'border-brand-600 text-brand-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                    isActive ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </BaseTabs.Tab>
          );
        })}
      </BaseTabs.List>
    </BaseTabs.Root>
  );
};
