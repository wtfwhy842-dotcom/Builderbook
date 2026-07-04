import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';

export function ReceiptViewer({ isOpen, imageUrl, onClose }: { isOpen: boolean; imageUrl: string; onClose: () => void }) {
  const [scale, setScale] = React.useState(1);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm">
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => setScale(s => s + 0.25)} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
          <ZoomIn size={24} />
        </button>
        <button onClick={() => setScale(s => Math.max(0.25, s - 0.25))} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
          <ZoomOut size={24} />
        </button>
        <button className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
          <Download size={24} />
        </button>
        <button onClick={onClose} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors ml-4">
          <X size={24} />
        </button>
      </div>
      
      <div className="relative overflow-hidden rounded-lg w-full max-w-3xl flex items-center justify-center h-[80vh]">
        <img 
          src={imageUrl} 
          alt="Receipt" 
          style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}
          className="max-w-full max-h-full object-contain cursor-move" 
        />
      </div>
    </div>
  );
}
