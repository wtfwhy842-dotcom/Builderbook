import React, { useEffect } from 'react';
import { Bell, AlertTriangle, Calendar, FileText, CheckCircle2, X } from 'lucide-react';

export function NotificationsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const notifications = [
    { id: 1, type: 'warning', title: 'VAT Return Due', message: 'Your Q3 VAT return is due in 5 days. Please ensure all receipts are uploaded.', time: '2 hours ago', icon: <Calendar size={18} /> },
    { id: 2, type: 'alert', title: 'Invoice Overdue', message: 'Invoice INV-2023-042 to Sarah Jenkins is 3 days overdue.', time: '1 day ago', icon: <AlertTriangle size={18} /> },
    { id: 3, type: 'info', title: 'Receipt Missing', message: '3 expenses this week are missing receipts.', time: '2 days ago', icon: <FileText size={18} /> },
    { id: 4, type: 'info', title: 'Large Expense Added', message: '£350.00 spent at Tom the Electrician.', time: '3 days ago', icon: <CheckCircle2 size={18} /> },
    { id: 5, type: 'success', title: 'Monthly Summary Ready', message: 'Your October financial summary is ready to view.', time: '5 days ago', icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:pt-20 sm:px-4 sm:pb-4 pointer-events-none">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm pointer-events-auto sm:hidden" onClick={onClose}></div>
      <div className="relative w-full sm:w-96 bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto max-h-[100vh] sm:max-h-[80vh] pointer-events-auto border border-gray-100">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-900" />
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <li key={n.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.type === 'warning' ? 'bg-amber-100 text-amber-600' : n.type === 'alert' ? 'bg-rose-100 text-rose-600' : n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {n.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{n.title}</h4>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-snug">{n.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
