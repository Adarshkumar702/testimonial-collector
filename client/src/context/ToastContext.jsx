import React, { createContext, useContext, useCallback } from 'react';
import { Toast as BaseToast } from '@base-ui/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

const ToastContext = createContext(null);

const ToastRenderer = ({ children }) => {
  const toastManager = BaseToast.useToastManager();

  const removeToast = useCallback((id) => {
    toastManager.close(id);
  }, [toastManager]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    return toastManager.add({
      title: message,
      type: type,
      timeout: duration,
    });
  }, [toastManager]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <BaseToast.Portal>
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
          {toastManager.toasts.map((toast) => (
            <BaseToast.Root
              key={toast.id}
              toast={toast}
              className={cn(
                'pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0',
                toast.type === 'success' && 'bg-emerald-900 text-emerald-50 border-emerald-700',
                toast.type === 'error' && 'bg-rose-900 text-rose-50 border-rose-700',
                toast.type === 'info' && 'bg-slate-900 text-slate-50 border-slate-700'
              )}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
                {toast.type === 'info' && <Info className="h-5 w-5 text-brand-400 shrink-0" />}
                <BaseToast.Title>{toast.title}</BaseToast.Title>
              </div>
              <BaseToast.Close
                className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </BaseToast.Close>
            </BaseToast.Root>
          ))}
        </div>
      </BaseToast.Portal>
    </ToastContext.Provider>
  );
};

export const ToastProvider = ({ children }) => {
  return (
    <BaseToast.Provider>
      <ToastRenderer>{children}</ToastRenderer>
    </BaseToast.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
