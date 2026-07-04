import React from 'react';
import { Calendar } from 'lucide-react';

export function CurrencyInput({ value, onChange, label, error }: { value: string; onChange: (val: string) => void; label?: string; error?: string }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-400">£</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-4 bg-gray-50 border ${error ? 'border-rose-300 focus:ring-rose-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'} rounded-2xl text-xl font-bold text-gray-900 focus:outline-none focus:ring-4 transition-all`}
          placeholder="0.00"
          inputMode="decimal"
        />
      </div>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}

export function DatePicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative w-full">
      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
      />
    </div>
  );
}

export function ImageUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [isCompressing, setIsCompressing] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      const file = e.target.files[0];
      
      try {
        // Simple canvas-based image compression
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        
        let width = bitmap.width;
        let height = bitmap.height;
        
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              onUpload(compressedFile);
            } else {
              onUpload(file);
            }
            setIsCompressing(false);
          }, 'image/jpeg', 0.8);
        } else {
          onUpload(file);
          setIsCompressing(false);
        }
      } catch (err) {
        onUpload(file);
        setIsCompressing(false);
      }
    }
  };

  return (
    <div className="w-full border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
      {isCompressing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-sm font-semibold text-gray-700">Compressing...</span>
        </div>
      )}
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      </div>
      <p className="font-semibold text-gray-900 text-center mb-2">Tap to take photo</p>
      <p className="text-sm text-gray-500 text-center">or select from gallery</p>
      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
    </div>
  );
}
