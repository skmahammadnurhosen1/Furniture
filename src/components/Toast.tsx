import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3.5 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="p-1 rounded-full bg-[#C08251] text-white shrink-0 mt-0.5">
            {toast.type === 'cart' ? (
              <ShoppingBag className="w-4 h-4" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4 fill-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-stone-300 mt-0.5">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
