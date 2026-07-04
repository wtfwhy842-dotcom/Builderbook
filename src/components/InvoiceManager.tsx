import React, { useState } from 'react';
import { Layout, ViewState } from './Layout';
import { mockIncome } from '../data';
import { FileText, Search, PlusCircle, ArrowRight, Download, Mail } from 'lucide-react';

export function InvoiceManager({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  const [search, setSearch] = useState('');

  const filteredInvoices = mockIncome.filter(i => 
    search === '' || 
    i.customerName.toLowerCase().includes(search.toLowerCase()) || 
    (i.invoiceNumber && i.invoiceNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="invoices">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Invoices</h1>
          <p className="text-gray-500">Manage your issued invoices and payments.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm">
          <PlusCircle size={20} /> New Invoice
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by customer or invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-gray-900"
          />
        </div>

        <div className="space-y-4">
          {filteredInvoices.map(invoice => (
            <div 
              key={invoice.id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
            >
              <div className="flex items-start gap-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-purple-100 text-purple-600">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{invoice.customerName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-gray-500">{invoice.invoiceNumber || 'Draft'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                  <p className="font-semibold text-gray-900">
                    £{invoice.amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors tooltip" title="Download PDF">
                    <Download size={18} />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors tooltip" title="Send Email">
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredInvoices.length === 0 && (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No invoices found</p>
              <p className="text-gray-500 mt-1">Try adjusting your search or create a new invoice.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
