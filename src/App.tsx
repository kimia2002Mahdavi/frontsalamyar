import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import { useProducts } from './hooks/useProducts';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading, hasMore, loadMore, totalCount } = useProducts(searchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            فروشگاه تجهیزات ورزشی
          </h1>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {searchTerm ? (
              <>نمایش {totalCount} نتیجه برای "{searchTerm}"</>
            ) : (
              <>نمایش همه محصولات ({totalCount} محصول)</>
            )}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; ۱۴۰۴ فروشگاه تجهیزات ورزشی. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;