import React, { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  
  let borderColor = 'border-l-[var(--accent)]';
  let icon = <Info size={20} className="text-[var(--accent)]" />;
  
  if (isSuccess) {
    borderColor = 'border-l-green-500';
    icon = <CheckCircle size={20} className="text-green-500" />;
  } else if (isError) {
    borderColor = 'border-l-red-500';
    icon = <XCircle size={20} className="text-red-500" />;
  }

  return (
    <div className={`relative flex items-start gap-3 bg-[var(--surface)] text-[var(--text)] px-4 py-3 rounded-lg shadow-xl border border-[var(--border)] border-l-4 ${borderColor} animate-stagger-fade-up min-w-[300px] overflow-hidden`}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button onClick={onRemove} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
        <X size={16} />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-[var(--border)] w-full">
        <div 
          className={`h-full ${isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-[var(--accent)]'}`}
          style={{ animation: 'shrink 3s linear forwards' }}
        />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}} />
    </div>
  );
};
