import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-200 bg-emerald-50 text-emerald-900';
        let iconClass = 'text-emerald-600';

        if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-rose-200 bg-rose-50 text-rose-900';
          iconClass = 'text-rose-600';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-amber-200 bg-amber-50 text-amber-900';
          iconClass = 'text-amber-600';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-200 bg-blue-50 text-blue-900';
          iconClass = 'text-blue-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-lg border shadow-lg text-xs font-medium transition-all transform translate-y-0 ${borderClass}`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
