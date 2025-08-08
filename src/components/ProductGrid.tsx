import React, { useEffect, useRef, useCallback } from 'react';
import { Product } from '../types/Product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const observer = useRef<IntersectionObserver>();
  
  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">محصولی یافت نشد</h3>
        <p className="text-gray-600">محصولی یافت نشد</p>
        <p className="text-gray-600 mt-1">معیارهای جستجو را تغییر دهید</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product, index) => {
          if (products.length === index + 1) {
            return (
              <div ref={lastProductElementRef} key={product.id}>
                <ProductCard product={product} />
              </div>
            );
          } else {
            return <ProductCard key={product.id} product={product} />;
          }
        })}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mr-2">در حال بارگذاری محصولات بیشتر...</span>
          </div>
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          به انتهای فهرست محصولات رسیده‌اید
        </div>
      )}
    </div>
  );
};

export default ProductGrid;