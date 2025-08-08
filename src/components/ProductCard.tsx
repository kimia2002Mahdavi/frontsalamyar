import React from 'react';
import { Product } from '../types/Product';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.isDiscounted && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            تخفیف
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {product.category}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mb-4">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)} تومان
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)} تومان
              </span>
            )}
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm">
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;