import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Heart } from 'lucide-react';
import { INSPIRATIONAL_QUOTES } from '../data/mockData';

export const DailyQuote: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pick daily quote based on current date index
    const day = new Date().getDate();
    setIndex(day % INSPIRATIONAL_QUOTES.length);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white py-2.5 px-4 shadow-inner relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs md:text-sm font-medium">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Frase del Día
          </span>
          <p className="text-slate-200 italic truncate font-light">
            "{INSPIRATIONAL_QUOTES[index]}"
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleNext}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            title="Siguiente mensaje inspirador"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
