import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sparkles, Check, X } from 'lucide-react';

interface ToastData {
  id: string;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-90 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-[#14202e] text-[#f8f1e4] p-4 shadow-xl border border-[#c8a45d]/40 rounded-none animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="mt-0.5 text-[#c8a45d] shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="flex-1">
              <p className="font-serif text-sm tracking-wide text-[#f8f1e4]">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#b8c0c8] mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#b8c0c8] hover:text-[#f8f1e4] transition-colors p-0.5 ml-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
