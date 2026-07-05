import React, { useState } from 'react';
import { Layout, ViewState } from './Layout';
import { useData } from '../context/DataContext';
import { Job, Expense, Income } from '../types';
import { Briefcase, Search, PlusCircle, ArrowRight, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { JobDetails } from './JobDetails';

export function JobManager({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  const { jobs, income, expenses, addJob } = useData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [showNewJob, setShowNewJob] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  if (selectedJob) {
    return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} onAddExpense={onAddExpense} onNavigate={onNavigate} />;
  }

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomerName.trim()) {
      addJob({
        customerName: newCustomerName,
        address: newAddress,
        status: 'Open',
      });
      setShowNewJob(false);
      setNewCustomerName('');
      setNewAddress('');
    }
  };

  const filteredJobs = jobs.filter(j => 
    search === '' || 
    j.customerName.toLowerCase().includes(search.toLowerCase()) || 
    (j.address && j.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="jobs">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Jobs</h1>
          <p className="text-gray-500">Manage your active and completed jobs.</p>
        </div>
        <button 
          onClick={() => setShowNewJob(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm">
          <PlusCircle size={20} /> New Job
        </button>
      </div>

      {showNewJob && (
        <form onSubmit={handleAddJob} className="bg-white p-4 sm:p-6 rounded-3xl border border-blue-100 shadow-md mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Job</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input required value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input value={newAddress} onChange={e => setNewAddress(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowNewJob(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Save Job</button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search customers or addresses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-gray-900"
          />
        </div>

        <div className="space-y-4">
          {filteredJobs.map(job => {
            const jobIncome = income.filter(i => i.jobId === job.id).reduce((sum, inc) => sum + inc.amount, 0);
            const jobExpenses = expenses.filter(e => e.jobId === job.id).reduce((sum, exp) => sum + exp.amount, 0);
            
            return (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl cursor-pointer hover:bg-blue-50/50 hover:border-blue-100 transition-all shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    job.status === 'Open' ? 'bg-emerald-100 text-emerald-600' : 
                    job.status === 'Quoted' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{job.customerName}</h3>
                    <p className="text-sm text-gray-500 mb-2">{job.address || 'No address provided'}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        job.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                        job.status === 'Quoted' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {job.status === 'Open' ? <Clock size={12}/> : <CheckCircle size={12}/>}
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Profit/Loss</p>
                    <p className={`font-semibold ${jobIncome - jobExpenses >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {jobIncome - jobExpenses >= 0 ? '+' : '-'}£{Math.abs(jobIncome - jobExpenses).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No jobs found</p>
              <p className="text-gray-500 mt-1">Try adjusting your search or add a new job.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
