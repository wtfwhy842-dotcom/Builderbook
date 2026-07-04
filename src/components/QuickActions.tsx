import React from 'react';
import { Receipt, PlusCircle, Briefcase, FilePlus } from 'lucide-react';
import { ViewState } from './Layout';

export function QuickActions({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <ActionButton 
        icon={<PlusCircle size={24} className="text-blue-600" />} 
        label="Add Expense" 
        color="bg-blue-50"
        onClick={onAddExpense}
      />
      <ActionButton 
        icon={<Receipt size={24} className="text-emerald-600" />} 
        label="Scan Receipt" 
        color="bg-emerald-50"
        onClick={onAddExpense}
      />
      <ActionButton 
        icon={<Briefcase size={24} className="text-amber-600" />} 
        label="New Job" 
        color="bg-amber-50"
        onClick={() => onNavigate?.('jobs')}
      />
      <ActionButton 
        icon={<FilePlus size={24} className="text-purple-600" />} 
        label="New Invoice" 
        color="bg-purple-50"
        onClick={() => onNavigate?.('invoices')}
      />
    </div>
  );
}

function ActionButton({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`${color} flex flex-col items-center justify-center p-4 rounded-2xl active:scale-95 transition-transform border border-black/5 shadow-sm`}>
      <div className="bg-white p-3 rounded-xl shadow-sm mb-3">
        {icon}
      </div>
      <span className="font-medium text-sm text-gray-800">{label}</span>
    </button>
  );
}
