import React from 'react';
import { Layout, ViewState } from './Layout';
import { 
  CreditCard, FileText, Calculator, Users, 
  Building2, Landmark, Bot, Mic, Barcode, 
  ShoppingCart, Wrench, Car, Shield, Briefcase
} from 'lucide-react';

export function ModuleManager({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  const modules = [
    { title: 'Invoice Payments', desc: 'Accept online card payments directly from invoices.', icon: <CreditCard size={24} />, status: 'Coming Q3' },
    { title: 'Quotes & Estimates', desc: 'Create and track quotes, convert to jobs instantly.', icon: <FileText size={24} />, status: 'Coming Q3' },
    { title: 'CIS Tax Tracking', desc: 'Automated Construction Industry Scheme deductions.', icon: <Calculator size={24} />, status: 'In Development' },
    { title: 'Payroll & Subcontractors', desc: 'Manage payments and slips for your team.', icon: <Users size={24} />, status: 'Planned' },
    { title: 'Open Banking Sync', desc: 'Live feed of your bank transactions for auto-reconciliation.', icon: <Landmark size={24} />, status: 'In Development' },
    { title: 'AI Bookkeeper', desc: 'Ask questions about your finances in plain English.', icon: <Bot size={24} />, status: 'Beta' },
    { title: 'Voice Expenses', desc: 'Log expenses hands-free while driving.', icon: <Mic size={24} />, status: 'Planned' },
    { title: 'Barcode Scanner', desc: 'Scan materials to instantly log costs and inventory.', icon: <Barcode size={24} />, status: 'Planned' },
    { title: 'Supplier Compare', desc: 'Compare material prices across major suppliers.', icon: <ShoppingCart size={24} />, status: 'Planned' },
    { title: 'Tool & Inventory Tracking', desc: 'Know where your equipment is and who has it.', icon: <Wrench size={24} />, status: 'Planned' },
    { title: 'Fleet Maintenance', desc: 'MOT, Tax, and service reminders for company vehicles.', icon: <Car size={24} />, status: 'Planned' },
    { title: 'Multi-User Access', desc: 'Give your accountant or office manager restricted access.', icon: <Shield size={24} />, status: 'Coming Q4' },
    { title: 'Multi-Business', desc: 'Manage multiple LTDs or sole traderships from one login.', icon: <Building2 size={24} />, status: 'Planned' },
    { title: 'HMRC Integration', desc: 'Direct MTD VAT and Self Assessment submission.', icon: <Briefcase size={24} />, status: 'Coming Q4' },
  ];

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="modules">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">App Modules</h1>
        <p className="text-gray-500">Extend BuilderBooks with powerful upcoming modules tailored for trades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-gray-50 border-b border-l border-gray-100 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {mod.status}
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {mod.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{mod.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{mod.desc}</p>
            <button className="mt-4 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
              Join Waitlist
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
