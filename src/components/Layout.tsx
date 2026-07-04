import { ReactNode, useState } from 'react';
import { Home, PlusCircle, Receipt, Briefcase, FileText, Settings, User, Search, Bell, Package } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsPanel } from './NotificationsPanel';

export type ViewState = 'dashboard' | 'add-expense' | 'receipts' | 'jobs' | 'invoices' | 'reports' | 'security' | 'modules';

export function Layout({ 
  children, 
  onAddExpense, 
  currentView = 'dashboard',
  onNavigate
}: { 
  children: ReactNode; 
  onAddExpense?: () => void;
  currentView?: ViewState;
  onNavigate?: (view: ViewState) => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:flex">
      {/* Mobile Header */}
      <header className="md:hidden bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            B
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">BuilderBooks</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSearchOpen(true)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-200 transition-colors">
            <Search size={18} />
          </button>
          <button onClick={() => setIsNotificationsOpen(true)} className="relative w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-200 transition-colors">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 sticky top-0 h-screen">
        <div className="px-6 py-6 flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            B
          </div>
          <span className="font-semibold text-gray-900 text-xl tracking-tight">BuilderBooks</span>
        </div>

        <div className="px-4 pb-4">
          <button onClick={() => setIsSearchOpen(true)} className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <Search size={18} />
            <span className="font-medium">Search...</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <NavItem icon={<Home size={20} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onNavigate?.('dashboard')} />
          <NavItem icon={<Receipt size={20} />} label="Receipts" active={currentView === 'receipts'} onClick={() => onNavigate?.('receipts')} />
          <NavItem icon={<Briefcase size={20} />} label="Jobs" active={currentView === 'jobs'} onClick={() => onNavigate?.('jobs')} />
          <NavItem icon={<FileText size={20} />} label="Invoices" active={currentView === 'invoices'} onClick={() => onNavigate?.('invoices')} />
          <NavItem icon={<FileText size={20} />} label="Reports" active={currentView === 'reports'} onClick={() => onNavigate?.('reports')} />
          <NavItem icon={<Package size={20} />} label="Modules" active={currentView === 'modules'} onClick={() => onNavigate?.('modules')} />
        </nav>
        
        <div className="p-4 space-y-1 border-t border-gray-100">
          <button onClick={() => setIsNotificationsOpen(true)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-medium text-left text-gray-600 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Bell size={20} />
              <span>Notifications</span>
            </div>
            <span className="flex w-5 h-5 bg-rose-500 rounded-full text-white text-[10px] items-center justify-center font-bold">3</span>
          </button>
          <button onClick={() => onNavigate?.('security')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-medium text-left ${currentView === 'security' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span>Security & Settings</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <BottomNavItem icon={<Home size={24} />} label="Home" active={currentView === 'dashboard'} onClick={() => onNavigate?.('dashboard')} />
        <BottomNavItem icon={<Receipt size={24} />} label="Receipts" active={currentView === 'receipts'} onClick={() => onNavigate?.('receipts')} />
        
        {/* Floating Action Button-style Add Button */}
        <div className="relative -top-5">
          <button onClick={onAddExpense} className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-transform">
            <PlusCircle size={28} />
          </button>
        </div>

        <BottomNavItem icon={<Briefcase size={24} />} label="Jobs" active={currentView === 'jobs'} onClick={() => onNavigate?.('jobs')} />
        <BottomNavItem icon={<FileText size={24} />} label="Invoices" active={currentView === 'invoices'} onClick={() => onNavigate?.('invoices')} />
      </nav>

      {onNavigate && <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={onNavigate} />}
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function BottomNavItem({ icon, label, active = false, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 py-2 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}>
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
