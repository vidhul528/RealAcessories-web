'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Check pending toast from sessionStorage (persists across page redirects)
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem('real_acc_pending_toast');
      if (pending) {
        const parsed = JSON.parse(pending);
        sessionStorage.removeItem('real_acc_pending_toast');
        if (parsed?.message) {
          triggerToast(parsed.message, parsed.type || 'success');
        }
      }
    } catch (err) {
      console.error('Failed to parse pending toast:', err);
    }
  }, []);

  const triggerToast = (message: string, type: ToastType = 'success') => {
    const newToast = { id: Date.now(), message, type };
    setToast(newToast);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToast((current) => (current?.id === newToast.id ? null : current));
    }, 3500);
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    // Save to sessionStorage in case of immediate route transition
    try {
      sessionStorage.setItem('real_acc_pending_toast', JSON.stringify({ message, type }));
    } catch (e) {
      // ignore fallback
    }
    triggerToast(message, type);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Global Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-[92%] bg-[#581C38] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#8C254F] flex items-center gap-3 animate-fadeIn pointer-events-auto">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
              toast.type === 'success'
                ? 'bg-[#8C254F]'
                : toast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-amber-600'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-white" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold text-white tracking-wide">
              {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification'}
            </p>
            <p className="text-[11px] text-white/90 font-light truncate">{toast.message}</p>
          </div>

          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
