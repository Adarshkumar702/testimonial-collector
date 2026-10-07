import React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export const Dialog = ({ isOpen, onClose, title, description, children, footer, className }) => {
  return (
    <BaseDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <BaseDialog.Popup
            className={cn(
              'relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transition-all border border-slate-200 focus:outline-none',
              className
            )}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                {title && <BaseDialog.Title className="text-lg font-semibold text-slate-900">{title}</BaseDialog.Title>}
                {description && <BaseDialog.Description className="text-sm text-slate-500 mt-0.5">{description}</BaseDialog.Description>}
              </div>
              <BaseDialog.Close
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </BaseDialog.Close>
            </div>

            <div className="py-4">{children}</div>

            {footer && <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">{footer}</div>}
          </BaseDialog.Popup>
        </div>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
