import React from 'react';
import { Plus } from 'lucide-react';

export function FloatingAddButton({ onClick, icon }: { onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all md:bottom-8 z-40"
    >
      {icon || <Plus size={28} />}
    </button>
  );
}
