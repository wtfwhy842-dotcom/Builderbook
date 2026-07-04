import { QuickActions } from './QuickActions';
import { SummaryCards } from './SummaryCards';
import { CashFlowChart } from './CashFlowChart';
import { ExpenseCategoryChart } from './ExpenseCategoryChart';
import { RecentLists } from './RecentLists';
import { Layout, ViewState } from './Layout';

export default function Dashboard({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500">Welcome back, here's what's happening today.</p>
      </div>

      <QuickActions onAddExpense={onAddExpense} onNavigate={onNavigate} />
      <SummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CashFlowChart />
        <ExpenseCategoryChart />
      </div>

      <RecentLists />
    </Layout>
  );
}
