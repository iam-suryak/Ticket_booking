import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating, count, showCount = true, size = 'sm' }) => {
  const starSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = rating >= starIndex;
          const isHalf = !isFilled && rating >= starIndex - 0.5;

          return (
            <div key={starIndex} className="relative">
              <Star
                className={`${starSize} ${
                  isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                }`}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className={`${starSize} fill-amber-400 text-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="font-semibold text-slate-900 text-sm">{rating.toFixed(1)}</span>
      {showCount && count && (
        <span className="text-slate-500 text-xs font-normal">({count})</span>
      )}
    </div>
  );
};
