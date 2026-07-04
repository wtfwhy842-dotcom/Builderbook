/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState, lazy } from 'react';
import { ViewState } from './components/Layout';
import { SecurityLock } from './components/SecurityLock';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ExpenseForm = lazy(() => import('./components/ExpenseForm').then(m => ({ default: m.ExpenseForm })));
const ReceiptManager = lazy(() => import('./components/ReceiptManager').then(m => ({ default: m.ReceiptManager })));
const JobManager = lazy(() => import('./components/JobManager').then(m => ({ default: m.JobManager })));
const InvoiceManager = lazy(() => import('./components/InvoiceManager').then(m => ({ default: m.InvoiceManager })));
const ReportManager = lazy(() => import('./components/ReportManager').then(m => ({ default: m.ReportManager })));
const SecuritySettings = lazy(() => import('./components/SecuritySettings').then(m => ({ default: m.SecuritySettings })));
const ModuleManager = lazy(() => import('./components/ModuleManager').then(m => ({ default: m.ModuleManager })));

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  return (
    <SecurityLock>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        {currentView === 'dashboard' && <Dashboard onAddExpense={() => setCurrentView('add-expense')} onNavigate={setCurrentView} />}
        {currentView === 'add-expense' && <ExpenseForm onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'receipts' && <ReceiptManager onAddExpense={() => setCurrentView('add-expense')} onNavigate={setCurrentView} />}
        {currentView === 'jobs' && <JobManager onAddExpense={() => setCurrentView('add-expense')} onNavigate={setCurrentView} />}
        {currentView === 'invoices' && <InvoiceManager onAddExpense={() => setCurrentView('add-expense')} onNavigate={setCurrentView} />}
        {currentView === 'reports' && <ReportManager onAddExpense={() => setCurrentView('add-expense')} onNavigate={setCurrentView} />}
        {currentView === 'security' && <SecuritySettings onAddExpense={() => setCurrentView('add-expense')} onNavigate={setCurrentView} />}
        {currentView === 'modules' && <ModuleManager onAddExpense={() => setCurrentView('add-expense')} onNavigate={setCurrentView} />}
      </Suspense>
    </SecurityLock>
  );
}
