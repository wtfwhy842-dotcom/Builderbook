import React from 'react';
import { Loader2, AlertTriangle, FileQuestion } from 'lucide-react';

export function EmptyState({ title, description, icon, actionText, onAction }: { title: string; description: string; icon?: React.ReactNode; actionText?: string; onAction?: () => void }) {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
      <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-4">
        {icon || <FileQuestion size={32} />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          {actionText}
        </button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="w-16 h-5 bg-gray-200 rounded shrink-0"></div>
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText?: string; cancelText?: string; isDestructive?: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`flex-1 py-3 px-4 text-white font-semibold rounded-xl transition-colors ${isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
