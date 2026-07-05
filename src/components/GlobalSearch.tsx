import React, { useState, useEffect } from 'react';
import { Search, X, Briefcase, Receipt, FileText, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ViewState } from './Layout';

export function GlobalSearch({ isOpen, onClose, onNavigate }: { isOpen: boolean; onClose: () => void; onNavigate: (view: ViewState) => void }) {
  const { jobs, expenses, income, receipts } = useData();
  const [query, setQuery] = useState('');

  // close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results: any[] = [];
  const lowerQuery = query.toLowerCase();

  if (query.trim().length > 0) {
    // Search Jobs
    jobs.forEach(job => {
      if (job.customerName.toLowerCase().includes(lowerQuery) || 
          (job.address && job.address.toLowerCase().includes(lowerQuery)) ||
          (job.notes && job.notes.toLowerCase().includes(lowerQuery))) {
        results.push({ type: 'job', id: job.id, title: job.customerName, subtitle: 'Job', icon: <Briefcase size={18} />, view: 'jobs' });
      }
    });

    // Search Expenses
    expenses.forEach(exp => {
      if (exp.supplier.toLowerCase().includes(lowerQuery) ||
          exp.category.toLowerCase().includes(lowerQuery) ||
          (exp.notes && exp.notes.toLowerCase().includes(lowerQuery))) {
        results.push({ type: 'expense', id: exp.id, title: `${exp.supplier} - £${exp.amount}`, subtitle: 'Expense', icon: <Receipt size={18} />, view: 'receipts' }); 
      }
    });

    // Search Receipts (OCR)
    receipts.forEach(rec => {
      if (rec.ocrText && rec.ocrText.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'receipt', id: rec.id, title: `Receipt ${rec.id.split('-')[1]}`, subtitle: 'Receipt (OCR Match)', icon: <Receipt size={18} />, view: 'receipts' });
      }
    });

    // Search Income
    income.forEach(inc => {
      if (inc.customerName.toLowerCase().includes(lowerQuery) ||
          (inc.invoiceNumber && inc.invoiceNumber.toLowerCase().includes(lowerQuery))) {
        results.push({ type: 'income', id: inc.id, title: `${inc.invoiceNumber || 'Draft'} - ${inc.customerName}`, subtitle: 'Invoice', icon: <FileText size={18} />, view: 'invoices' });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <Search size={24} className="text-gray-400 mr-3" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search jobs, expenses, invoices, receipts..." 
            className="flex-1 bg-transparent text-xl font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Type to search across all your data.</p>
            </div>
          ) : results.length > 0 ? (
            <ul className="space-y-1">
              {results.map((r, i) => (
                <li key={i}>
                  <button onClick={() => { onNavigate(r.view as ViewState); onClose(); }} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {r.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No results found for "{query}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
