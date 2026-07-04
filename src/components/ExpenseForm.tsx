import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { mockJobs } from '../data';

export function ExpenseForm({ onBack }: { onBack: () => void }) {
  const [receiptAttached, setReceiptAttached] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [payment, setPayment] = useState<string>('Card');
  const [jobId, setJobId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [vat, setVat] = useState<string>('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptAttached(true);
    setIsScanning(true);

    try {
      // Convert to base64 for display/storage
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;

        // Call OCR API
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            mimeType: file.type
          })
        });

        if (!response.ok) {
          throw new Error('OCR failed');
        }

        const data = await response.json();
        
        // Populate form
        if (data.amount) setAmount(data.amount.toString());
        if (data.supplier) setSupplier(data.supplier);
        if (data.category) setCategory(data.category);
        if (data.vat) setVat(data.vat.toString());
        
        setIsScanning(false);
      };
    } catch (error) {
      console.error("Error scanning receipt:", error);
      alert("Could not read receipt automatically. Please enter details manually.");
      setIsScanning(false);
    }
  };

  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setValidationError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!supplier.trim()) {
      setValidationError('Supplier name is required.');
      return;
    }
    if (!category) {
      setValidationError('Please select a category.');
      return;
    }

    setValidationError('');
    // Optimistic Update Simulation
    import('../security').then(({ addAuditLog }) => {
      addAuditLog('EXPENSE_ADDED', `Added expense: £${amount} at ${supplier}`);
    });

    // Background Sync Registration
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration: any) => {
        return registration.sync.register('sync-expenses');
      }).catch(err => console.log('Background sync registration failed:', err));
    }

    setTimeout(() => {
      onBack();
    }, 100); // Super fast transition for optimistic UI feel
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto w-full bg-white md:border-x md:border-gray-200 md:shadow-xl">
        <header className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center text-gray-600 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors mr-2"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">New Expense</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          <form id="expense-form" data-testid="expense-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 pb-8">

            {/* Receipt Upload (Moved to top for workflow) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt</label>
              {!receiptAttached ? (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-blue-600 active:bg-blue-100 transition-colors cursor-pointer shadow-sm">
                    <Camera size={28} />
                    <span className="font-semibold">Take Photo</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-600 active:bg-gray-100 transition-colors cursor-pointer shadow-sm">
                    <ImageIcon size={28} />
                    <span className="font-semibold">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              ) : (
                <div className={`flex items-center justify-between rounded-2xl p-5 shadow-sm border ${isScanning ? 'bg-indigo-50 border-indigo-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex items-center gap-3">
                    {isScanning ? (
                      <>
                        <Loader2 size={28} className="text-indigo-600 animate-spin" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-indigo-700 flex items-center gap-1"><Sparkles size={16}/> AI Scanning...</span>
                          <span className="text-xs text-indigo-600/70">Extracting details automatically</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={28} className="text-emerald-600" />
                        <span className="font-semibold text-emerald-700">Receipt scanned</span>
                      </>
                    )}
                  </div>
                  {!isScanning && (
                    <button type="button" onClick={() => { setReceiptAttached(false); setAmount(''); setSupplier(''); setCategory(''); setVat(''); }} className="font-semibold text-emerald-700 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="bg-gray-50 rounded-3xl p-6 flex flex-col items-center justify-center border border-gray-100 shadow-inner">
              <label className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Amount</label>
              
              {validationError && (
                <div className="w-full bg-rose-50 text-rose-600 text-sm p-3 rounded-xl mb-4 text-center border border-rose-100">
                  {validationError}
                </div>
              )}

              <div className="flex items-center">
                <span className="text-4xl font-semibold text-gray-400 mr-2">£</span>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-6xl font-bold text-gray-900 bg-transparent border-none outline-none w-full max-w-[240px] text-center placeholder-gray-300 p-0 tracking-tight"
                />
              </div>
              {vat && (
                <span className="text-sm text-gray-500 mt-2 font-medium">Includes £{vat} VAT</span>
              )}
            </div>

            <div className="space-y-5">
              {/* Supplier */}
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1.5">Supplier / Merchant</label>
                <input
                  id="supplier"
                  type="text"
                  required
                  placeholder="e.g. Toolstation, BP, Screwfix"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all text-lg"
                />
              </div>

              {/* Category & Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select 
                    id="category"
                    required 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3.5 text-gray-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none appearance-none text-lg"
                  >
                    <option value="" disabled>Select...</option>
                    <option value="Materials">Materials</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Tools">Tools</option>
                    <option value="Subcontractors">Subcontractors</option>
                    <option value="Meals">Meals</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment</label>
                  <select 
                    required 
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3.5 text-gray-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none appearance-none text-lg"
                  >
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Job Allocation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign to Job (Optional)</label>
                <select 
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3.5 text-gray-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none appearance-none text-lg"
                >
                  <option value="">None / General Business</option>
                  {mockJobs.map(job => (
                    <option key={job.id} value={job.id}>{job.customerName}</option>
                  ))}
                </select>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (Optional)</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any extra details..."
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all resize-none text-lg"
                />
              </div>
            </div>

          </form>
        </div>

        <div className="border-t border-gray-100 bg-white p-4 pb-6 sm:pb-4 sticky bottom-0 z-10">
          <button 
            form="expense-form"
            type="submit" 
            disabled={isScanning}
            className={`w-full font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 ${isScanning ? 'bg-gray-300 text-gray-500 shadow-none' : 'bg-blue-600 text-white shadow-blue-600/25'}`}
          >
            <CheckCircle2 size={24} />
            {isScanning ? 'Wait for Scan...' : 'Save Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
