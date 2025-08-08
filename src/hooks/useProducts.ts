import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types/Product';
import { products as staticProducts } from '../data/products';

const ITEMS_PER_PAGE = 8;

export const useProducts = (searchTerm: string) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return staticProducts;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    return staticProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseSearch) ||
      product.description.toLowerCase().includes(lowercaseSearch) ||
      product.category.toLowerCase().includes(lowercaseSearch)
    );
  }, [searchTerm]);

  // Reset pagination when search term changes
  useEffect(() => {
    setPage(1);
    setDisplayedProducts(filteredProducts.slice(0, ITEMS_PER_PAGE));
  }, [filteredProducts]);

  const loadMore = () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = filteredProducts.slice(startIndex, endIndex);
      
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setLoading(false);
    }, 1000);
  };

  const hasMore = displayedProducts.length < filteredProducts.length;

  return {
    products: displayedProducts,
    loading,
    hasMore,
    loadMore,
    totalCount: filteredProducts.length
  };
};