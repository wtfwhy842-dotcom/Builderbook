import React, { useState } from 'react';
import { Layout, ViewState } from './Layout';
import { BarChart3, Download, FileSpreadsheet, FileText, PieChart } from 'lucide-react';
import { mockExpenses, mockIncome, mockJobs } from '../data';

export function ReportManager({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [reportType, setReportType] = useState<'pnl' | 'vat' | 'expense' | 'income' | 'jobs'>('pnl');

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    alert(`Exporting ${reportType} report for ${period} as ${type.toUpperCase()}`);
  };

  // Mock calculations for demonstration
  const totalIncome = mockIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalVatCollected = mockIncome.reduce((sum, inc) => sum + inc.vat, 0);
  const totalVatPaid = mockExpenses.reduce((sum, exp) => sum + exp.vat, 0);

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="reports">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
          <p className="text-gray-500">Generate financial summaries and export data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('csv')} className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm">
            <FileText size={18} /> CSV
          </button>
          <button onClick={() => handleExport('excel')} className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-green-700 rounded-xl font-medium hover:bg-green-50 active:scale-[0.98] transition-all shadow-sm">
            <FileSpreadsheet size={18} /> Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 border border-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm">
            <Download size={18} /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Time Period</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'weekly', label: 'Weekly' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'quarterly', label: 'Quarterly' },
                { id: 'yearly', label: 'Yearly' },
              ].map((p) => (
                <button 
                  key={p.id}
                  onClick={() => setPeriod(p.id as any)}
                  className={`text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${period === p.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Report Type</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'pnl', label: 'Profit & Loss', icon: <BarChart3 size={18} /> },
                { id: 'vat', label: 'VAT Summary', icon: <PieChart size={18} /> },
                { id: 'expense', label: 'Expense Summary', icon: <PieChart size={18} /> },
                { id: 'income', label: 'Income Summary', icon: <BarChart3 size={18} /> },
                { id: 'jobs', label: 'Job Profitability', icon: <BarChart3 size={18} /> },
              ].map((r) => (
                <button 
                  key={r.id}
                  onClick={() => setReportType(r.id as any)}
                  className={`flex items-center gap-3 text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${reportType === r.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {r.icon}
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
          <div className="border-b border-gray-100 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {reportType === 'pnl' ? 'Profit & Loss' : 
                 reportType === 'vat' ? 'VAT Summary' : 
                 reportType === 'expense' ? 'Expense Summary' : 
                 reportType === 'income' ? 'Income Summary' : 'Job Profitability'}
              </h2>
              <p className="text-gray-500 capitalize">{period} Report</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              {reportType === 'vat' || reportType === 'expense' ? <PieChart size={24} /> : <BarChart3 size={24} />}
            </div>
          </div>

          {reportType === 'pnl' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="font-medium text-gray-600">Total Income</span>
                <span className="font-bold text-gray-900">£{totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="font-medium text-gray-600">Total Expenses</span>
                <span className="font-bold text-gray-900">£{totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-gray-50 px-4 rounded-xl">
                <span className="font-bold text-gray-900 text-lg">Net Profit</span>
                <span className={`font-bold text-xl ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {totalIncome - totalExpenses >= 0 ? '+' : '-'}£{Math.abs(totalIncome - totalExpenses).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {reportType === 'vat' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="font-medium text-gray-600">VAT Collected (on Income)</span>
                <span className="font-bold text-gray-900">£{totalVatCollected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="font-medium text-gray-600">VAT Paid (on Expenses)</span>
                <span className="font-bold text-gray-900">£{totalVatPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-gray-50 px-4 rounded-xl">
                <span className="font-bold text-gray-900 text-lg">Net VAT Due</span>
                <span className={`font-bold text-xl ${totalVatCollected - totalVatPaid >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  £{Math.abs(totalVatCollected - totalVatPaid).toFixed(2)}
                  <span className="text-sm font-medium ml-2 text-gray-500">
                    {totalVatCollected - totalVatPaid >= 0 ? '(To Pay)' : '(To Reclaim)'}
                  </span>
                </span>
              </div>
            </div>
          )}

          {reportType === 'jobs' && (
            <div className="space-y-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Job / Customer</th>
                    <th className="pb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Income</th>
                    <th className="pb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Costs</th>
                    <th className="pb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockJobs.map(job => {
                    const inc = mockIncome.filter(i => i.jobId === job.id).reduce((sum, i) => sum + i.amount, 0);
                    const exp = mockExpenses.filter(e => e.jobId === job.id).reduce((sum, e) => sum + e.amount, 0);
                    const prof = inc - exp;
                    return (
                      <tr key={job.id}>
                        <td className="py-4 font-medium text-gray-900">{job.customerName}</td>
                        <td className="py-4 text-right">£{inc.toFixed(2)}</td>
                        <td className="py-4 text-right">£{exp.toFixed(2)}</td>
                        <td className={`py-4 text-right font-semibold ${prof >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {prof >= 0 ? '+' : '-'}£{Math.abs(prof).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {(reportType === 'expense' || reportType === 'income') && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <PieChart size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-900">Detailed breakdown</p>
              <p className="text-sm">Summary visualization would appear here.</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
