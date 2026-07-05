import React, { useState } from 'react';
import { Layout, ViewState } from './Layout';
import { useData } from '../context/DataContext';
import { Job, Expense, Income } from '../types';
import { ArrowLeft, Edit3, Image as ImageIcon, MapPin, Phone, Mail, Receipt, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

export function JobDetails({ job, onBack, onAddExpense, onNavigate }: { job: Job; onBack: () => void; onAddExpense?: () => void; onNavigate?: (view: ViewState) => void; }) {
  const { income, expenses, receipts } = useData();
  const jobIncome = income.filter(i => i.jobId === job.id);
  const jobExpenses = expenses.filter(e => e.jobId === job.id);
  const jobReceipts = receipts.filter(r => jobExpenses.some(e => e.receiptId === r.id));

  const totalIncome = jobIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = jobExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const profit = totalIncome - totalExpenses;
  const margin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  // Aggregate expenses by category
  const categoryTotals: Record<string, number> = {};
  jobExpenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const pieData = Object.keys(categoryTotals).map(key => ({
    name: key,
    value: categoryTotals[key]
  }));

  // Timeline (merge income and expenses, sort by date)
  const timelineEvents = [
    ...jobIncome.map(i => ({ type: 'income', date: new Date(i.date), amount: i.amount, label: `Invoice ${i.invoiceNumber || 'Paid'}` })),
    ...jobExpenses.map(e => ({ type: 'expense', date: new Date(e.date), amount: e.amount, label: `${e.supplier} (${e.category})` }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="jobs">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
          <ArrowLeft size={20} /> Back to Jobs
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          <Edit3 size={16} /> Edit Job
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{job.customerName}</h1>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                job.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                job.status === 'Quoted' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {job.status}
              </span>
            </div>
            
            <div className="space-y-2 mt-4">
              {job.address && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={16} className="text-gray-400" /> {job.address}
                </div>
              )}
              {job.phone && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone size={16} className="text-gray-400" /> {job.phone}
                </div>
              )}
              {job.email && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={16} className="text-gray-400" /> {job.email}
                </div>
              )}
            </div>
          </div>
          
          {/* High-level financials */}
          <div className="flex flex-row gap-4 md:gap-8 bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-100 shrink-0">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">£{totalIncome.toFixed(2)}</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">£{totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {job.notes && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-2 text-gray-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
              <FileText size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{job.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profitability Panel */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              Profitability
            </h3>
            
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Gross Profit</p>
              <p className={`text-4xl font-bold tracking-tight ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {profit >= 0 ? '+' : '-'}£{Math.abs(profit).toFixed(2)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Profit Margin</p>
              <p className="text-2xl font-semibold text-gray-900">{margin.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            {margin < 20 ? (
              <div className="flex items-start gap-2 text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>Margin is below 20%. Consider reviewing material costs or labor hours.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-sm">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <p>Healthy profit margin on this job.</p>
              </div>
            )}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          
          {jobExpenses.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-8 h-full min-h-[250px]">
              <div className="h-48 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => `£${value.toFixed(2)}`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 space-y-4">
                {pieData.map((data, index) => (
                  <div key={data.name} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {data.name}
                      </span>
                      <span>£{data.value.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(data.value / totalExpenses) * 100}%`, backgroundColor: COLORS[index % COLORS.length] }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No expenses recorded yet.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Timeline */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200"></div>
            <div className="space-y-6">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative flex gap-4 pl-10">
                  <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 z-10 ${evt.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {evt.type === 'income' ? <ArrowLeft size={14} className="text-white rotate-45" /> : <ArrowLeft size={14} className="text-white -rotate-135" />}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{evt.label}</p>
                      <p className={`font-semibold text-sm ${evt.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {evt.type === 'income' ? '+' : '-'}£{evt.amount.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{evt.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
              {timelineEvents.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No activity yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Receipts & Photos Gallery */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Receipts & Photos</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
               View all <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {jobReceipts.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {jobReceipts.map(receipt => (
                  <div key={receipt.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group relative">
                    <img src={receipt.thumbnailUrl || receipt.originalImageUrl} alt="Receipt" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Receipt size={24} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={48} className="mb-3 text-gray-300" />
                <p className="font-medium text-gray-900">No photos</p>
                <p className="text-sm">Attach receipts to expenses to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
