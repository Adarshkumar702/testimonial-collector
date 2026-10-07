import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Carousel = ({ items = [], renderItem, theme = 'light' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn('relative w-full max-w-2xl mx-auto px-10 py-4')}>
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="w-full shrink-0 px-2">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md transition-colors',
              theme === 'dark' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-100 border'
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md transition-colors',
              theme === 'dark' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-100 border'
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="flex justify-center gap-1.5 mt-4">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  currentIndex === idx
                    ? 'w-6 bg-brand-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
