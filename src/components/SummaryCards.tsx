import React from 'react';
import { summaryData } from '../data';
import { ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';

export function SummaryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <SummaryCard 
        title="Today's Spending" 
        amount={`£${summaryData.todaySpending.toFixed(2)}`}
        icon={<ArrowDownRight size={18} className="text-rose-500" />}
        trend="+12% from yesterday"
      />
      <SummaryCard 
        title="This Week" 
        amount={`£${summaryData.weekSpending.toFixed(2)}`}
        icon={<ArrowDownRight size={18} className="text-rose-500" />}
      />
      <SummaryCard 
        title="This Month" 
        amount={`£${summaryData.monthSpending.toFixed(2)}`}
        icon={<ArrowDownRight size={18} className="text-rose-500" />}
      />
      <SummaryCard 
        title="Outstanding Invoices" 
        amount={`£${summaryData.outstandingInvoices.toFixed(2)}`}
        icon={<Clock size={18} className="text-amber-500" />}
        highlight
      />
    </div>
  );
}

function SummaryCard({ title, amount, icon, highlight = false, trend }: { title: string; amount: string; icon: React.ReactNode; highlight?: boolean; trend?: string }) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{title}</h3>
        <div className={`p-1.5 rounded-lg ${highlight ? 'bg-white/20' : 'bg-gray-50'}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight">{amount}</span>
        {trend && (
          <span className={`text-xs mt-1 ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{trend}</span>
        )}
      </div>
    </div>
  );
}
