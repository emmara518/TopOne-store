import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastRegion: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold shadow-lg backdrop-blur-md border transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isSuccess 
                ? 'bg-[#302528] text-white border-[#597B6D]/40' 
                : isError
                ? 'bg-[#B84E58] text-white border-white/20'
                : 'bg-[#272124] text-white border-white/10'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#89B8A2] shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-[#FBE9EB] shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-[#E1B8A6] shrink-0" />}
            <span className="leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
