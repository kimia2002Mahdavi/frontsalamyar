import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
                ? 'text-orange-400 fill-current'
                : index === fullStars && hasHalfStar
                ? 'text-orange-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating} ({reviewCount} نظر)
      </span>
    </div>
  );
};

export default StarRating;