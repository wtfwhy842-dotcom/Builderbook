import { mockExpenses, mockJobs } from '../data';
import { Receipt as ReceiptIcon, Briefcase } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export function RecentLists() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Recent Expenses */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {mockExpenses.slice(0, 4).map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <ReceiptIcon size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.supplier}</p>
                  <p className="text-xs text-gray-500">{expense.category} • {formatDate(expense.date)}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">-£{expense.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Jobs */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {mockJobs.filter(j => j.status === 'Open').slice(0, 4).map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{job.customerName}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{job.address}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
