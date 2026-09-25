import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'sm',
  showNumber = true
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className="inline-flex items-center gap-1 text-slate-700">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-100 text-slate-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="font-semibold text-xs tabular-nums text-slate-900 ml-0.5">
          {rounded.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-slate-400 text-xs">
          ({count})
        </span>
      )}
    </div>
  );
};
