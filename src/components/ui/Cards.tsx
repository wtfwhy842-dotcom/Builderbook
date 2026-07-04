import React from 'react';
import { Briefcase, Receipt, FileText, ChevronRight } from 'lucide-react';

export function ExpenseCard({ expense, onClick }: { expense: any; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Receipt size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{expense.supplier}</h4>
          <p className="text-sm text-gray-500">{expense.category} • {expense.date}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900">£{expense.amount.toFixed(2)}</p>
        <ChevronRight size={20} className="text-gray-400 inline-block" />
      </div>
    </div>
  );
}

export function JobCard({ job, onClick }: { job: any; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase size={20} />
          </div>
          <h4 className="font-bold text-gray-900">{job.customerName}</h4>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
          {job.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{job.address}</p>
      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
        <span className="text-sm font-medium text-gray-500">Budget: £{job.budget}</span>
        <span className="text-sm font-bold text-gray-900">Spent: £{job.expenses}</span>
      </div>
    </div>
  );
}

export function DashboardTile({ title, value, subtitle, icon, trend }: { title: string; value: string; subtitle: string; icon: React.ReactNode; trend?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{value}</p>
        <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}
