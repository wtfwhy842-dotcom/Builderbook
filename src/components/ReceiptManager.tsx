import React, { useState } from 'react';
import { Layout, ViewState } from './Layout';
import { mockReceipts } from '../data';
import { Receipt } from '../types';
import { Search, Filter, Download, Trash2, FileText, Image as ImageIcon, X } from 'lucide-react';

export function ReceiptManager({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = search === '' || (r.ocrText && r.ocrText.toLowerCase().includes(search.toLowerCase())) || r.uploadDate.includes(search);
    return matchesSearch;
  });
  
  const paginatedReceipts = filteredReceipts.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (visibleCount < filteredReceipts.length) {
        setVisibleCount(prev => prev + 10);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      setReceipts(receipts.filter(r => r.id !== id));
      if (selectedReceipt?.id === id) {
        setSelectedReceipt(null);
      }
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const handleReplace = () => {
    alert("Replace receipt functionality would open camera/file picker here.");
  };

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="receipts">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Receipts</h1>
          <p className="text-gray-500">Manage and view your scanned receipts.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left pane: List */}
        <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col h-full ${selectedReceipt ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search receipts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
            {paginatedReceipts.map(receipt => (
              <div 
                key={receipt.id}
                onClick={() => setSelectedReceipt(receipt)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedReceipt?.id === receipt.id ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img src={receipt.thumbnailUrl || receipt.originalImageUrl} alt="Receipt thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Receipt {receipt.id.split('-')[1]}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(receipt.uploadDate).toLocaleDateString()}</p>
                    {receipt.ocrText && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{receipt.ocrText}</p>}
                  </div>
                </div>
              </div>
            ))}
            {filteredReceipts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No receipts found.</p>
              </div>
            )}
            {visibleCount < filteredReceipts.length && (
              <div className="p-4 text-center">
                <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Details */}
        <div className={`flex-1 flex flex-col bg-gray-50/50 ${!selectedReceipt ? 'hidden md:flex' : 'flex'}`}>
          {selectedReceipt ? (
            <>
              <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedReceipt(null)} className="md:hidden p-2 -ml-2 text-gray-500 rounded-full hover:bg-gray-100">
                    <X size={20} />
                  </button>
                  <h2 className="font-semibold text-gray-900">Receipt Details</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDownload(selectedReceipt.originalImageUrl)} className="p-2 text-gray-600 rounded-full hover:bg-gray-100 tooltip" title="Download">
                    <Download size={18} />
                  </button>
                  <button onClick={() => handleDelete(selectedReceipt.id)} className="p-2 text-rose-600 rounded-full hover:bg-rose-50 tooltip" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
                
                {/* Image Preview */}
                <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="aspect-[3/4] sm:aspect-auto sm:h-96 w-full bg-gray-100 rounded-xl overflow-hidden relative group">
                    <img src={selectedReceipt.originalImageUrl} alt="Full receipt" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={handleReplace} className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2">
                        <ImageIcon size={18} /> Replace Image
                      </button>
                    </div>
                  </div>
                </div>

                {/* OCR Text */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Extracted Text (OCR)</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {selectedReceipt.ocrText || "No text extracted from this receipt yet."}
                    </pre>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <ImageIcon size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-900">Select a receipt</p>
              <p className="text-sm mt-1">Choose a receipt from the list to view its details.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
