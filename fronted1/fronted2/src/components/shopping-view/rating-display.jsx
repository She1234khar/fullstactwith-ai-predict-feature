import React from 'react';
import { Star, StarOff } from 'lucide-react';

export default function RatingDisplay({ rating, totalReviews, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-yellow-400">
        {index < Math.floor(rating) ? (
          <Star className={`${sizeClasses[size]} fill-current`} />
        ) : index < rating ? (
          <Star className={`${sizeClasses[size]} fill-current`} />
        ) : (
          <StarOff className={sizeClasses[size]} />
        )}
      </span>
    ));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {renderStars()}
      </div>
      {totalReviews > 0 && (
        <span className="text-sm text-gray-600">
          ({rating.toFixed(1)} • {totalReviews} review{totalReviews !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
} 