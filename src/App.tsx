import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef

// --- components/SearchBar.jsx ---
/**
 * @param {object} props
 * @param {string} props.searchTerm - The current search term.
 * @param {(term: string) => void} props.onSearchChange - Function to call when the search term changes.
 */
function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        {/* Search Icon (Magnifying Glass) */}
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full rounded-md border-gray-300 pr-10 pl-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
        placeholder="جستجو بر اساس نام محصول..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        dir="rtl" // Right-to-left direction for Persian text
      />
    </div>
  );
}

// --- components/ProductGrid.jsx ---
/**
 * @param {object} props
 * @param {Array<object>} props.products - List of products to display.
 * @param {boolean} props.loading - Indicates if products are currently being loaded.
 * @param {boolean} props.hasMore - Indicates if there are more products to load.
 * @param {() => void} props.onLoadMore - Function to call to load more products.
 * @param {Array<object>} props.selectedProducts - List of currently selected products for multi-selection search.
 * @param {(product: object) => void} props.onProductSelect - Function to call when a product is selected for multi-selection.
 * @param {(productId: string) => void} props.onProductDeselect - Function to call when a product is deselected from multi-selection.
 */
function ProductGrid({ products, loading, hasMore, onLoadMore, selectedProducts, onProductSelect, onProductDeselect }) {
  const selectedProductIds = new Set(selectedProducts.map(p => p.id));
  const loader = useRef(null); // Ref for the loading indicator element

  useEffect(() => {
    // Set up IntersectionObserver for infinite scrolling
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '20px', // Start loading 20px before reaching the bottom
      threshold: 1.0, // When 100% of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore(); // Load more products when the loader element is visible
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current); // Start observing the loader element
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current); // Clean up the observer on component unmount
      }
    };
  }, [loading, hasMore, onLoadMore]); // Re-run effect if these dependencies change


  if (products.length === 0 && !loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p className="text-lg mb-2">هیچ محصولی یافت نشد. 😞</p>
        <p className="text-sm">لطفاً کلمه کلیدی دیگری را امتحان کنید.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isSelected = selectedProductIds.has(product.id);
          return (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl ${
                isSelected ? 'border-2 border-orange-500' : '' // Highlight selected products
              }`}
            >
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                {/* Placeholder image for product */}
                <img
                  src={`https://placehold.co/400x300/F3F4F6/6B7280?text=${product.name.replace(/ /g, '+')}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "https://placehold.co/400x300/F3F4F6/6B7280?text=تصویر+موجود+نیست";
                  }}
                />
              </div>
              <div className="p-4 text-right" dir="rtl"> {/* Right-to-left for Persian text */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-orange-600">{product.price.toLocaleString('fa-IR')} تومان</span>
                  {isSelected ? (
                    <button
                      onClick={() => onProductDeselect(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 w-44" // Added w-44
                    >
                      حذف از لیست انتخاب
                    </button>
                  ) : (
                    <button
                      onClick={() => onProductSelect(product)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-300 w-44" // Added w-44
                    >
                      انتخاب محصول
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Loading indicator for infinite scroll */}
      {loading && products.length > 0 && ( // Show loading indicator only when fetching and products exist
        <div className="flex justify-center mt-8 py-4">
          <p className="text-orange-600 font-semibold text-sm">در حال بارگذاری محصولات بیشتر...</p>
        </div>
      )}
      {!loading && hasMore && ( // Show empty div as target for IntersectionObserver only if more products exist
         <div ref={loader} className="h-1" /> // A small, invisible div at the bottom
      )}
       {!hasMore && products.length > 0 && ( // Message when all products are loaded
        <div className="flex justify-center mt-8 py-4">
          <p className="text-gray-500 text-sm">همه محصولات بارگذاری شدند.</p>
        </div>
      )}
    </>
  );
}

// --- components/SelectedProductsDisplay.jsx ---
/**
 * @param {object} props
 * @param {Array<object>} props.selectedProducts - List of currently selected products.
 * @param {(productId: string) => void} props.onProductRemove - Function to call when a product is removed from selection.
 * @param {() => void} props.onAddSelectedToCart - Function to call to add selected products to the cart.
 */
function SelectedProductsDisplay({ selectedProducts, onProductRemove, onAddSelectedToCart }) {
  if (selectedProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500" dir="rtl">
        <p>هنوز محصولی برای جستجو انتخاب نکرده‌اید.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8" dir="rtl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">محصولات انتخاب شده برای جستجو:</h2>
      <div className="flex flex-wrap gap-3">
        {selectedProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center bg-orange-100 text-orange-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm"
          >
            <span>{product.name}</span>
            <button
              onClick={() => onProductRemove(product.id)}
              className="ml-2 text-orange-600 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full"
              aria-label={`Remove ${product.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onAddSelectedToCart}
          className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition duration-300 shadow-lg"
        >
          انتقال به سبد خرید
        </button>
      </div>
    </div>
  );
}

// --- components/CartModal.jsx ---
/**
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {() => void} props.onClose - Function to call to close the modal.
 * @param {Array<object>} props.cartItems - List of items in the cart. Each item has { product: object, quantity: number }.
 * @param {(productId: string, newQuantity: number) => void} props.onUpdateQuantity - Function to update an item's quantity.
 * @param {(productId: string) => void} props.onRemoveItem - Function to remove an item from the cart.
 */
function CartModal({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // State to hold stalls found for current cart items
  const [matchingStalls, setMatchingStalls] = useState([]);

  // Mock data for vendor inventory (mapping products to vendors)
  // This simulates what a backend API might return for product availability across stalls
  const MOCK_STALL_INVENTORY = [
    { vendor_id: 'v1', vendor_name: 'غرفه ورزشی الف', product_ids: ['1', '2', '4', '7'] },
    { vendor_id: 'v2', vendor_name: 'ورزش پلاس', product_ids: ['1', '3', '5', '8', '10', '11'] },
    { vendor_id: 'v3', vendor_name: 'بوفه سلامتی', product_ids: ['2', '6', '7', '10', '13', '14'] },
    { vendor_id: 'v4', vendor_name: 'اسپورت سنتر', product_ids: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'] }, // A super stall with all products
    { vendor_id: 'v5', vendor_name: 'تجهیزات مدرن', product_ids: ['9', '10', '11', '12', '15', '16'] },
    { vendor_id: 'v6', vendor_name: 'معدن قهرمانان', product_ids: ['15', '16', '17', '18', '19', '20', '1', '2'] },
  ];

  // Function to find stalls that contain all products in the cart
  const findOverlappingStalls = useCallback((currentCartItems) => {
    if (currentCartItems.length === 0) return [];

    const cartProductIds = new Set(currentCartItems.map(item => item.product.id));
    const results = [];

    MOCK_STALL_INVENTORY.forEach(stall => {
      const matchedProductsInStall = [];
      const stallProductIds = new Set(stall.product_ids);

      let allProductsFound = true;
      for (const cartItem of currentCartItems) {
        if (stallProductIds.has(cartItem.product.id)) {
          matchedProductsInStall.push(cartItem.product);
        } else {
          allProductsFound = false; // This stall does not have ALL products in the cart
          break;
        }
      }

      if (allProductsFound) { // Only include stalls that have ALL products from the cart
        results.push({
          vendor_id: stall.vendor_id,
          vendor_name: stall.vendor_name,
          products_in_cart: matchedProductsInStall // Products from the cart that this stall has
        });
      }
    });

    // Sort by vendor name
    results.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));

    return results;
  }, [MOCK_STALL_INVENTORY]); // MOCK_STALL_INVENTORY is static, so this dependency is fine.

  // Effect to re-calculate matching stalls whenever cartItems change
  useEffect(() => {
    if (isOpen) { // Only calculate when the modal is open
      setMatchingStalls(findOverlappingStalls(cartItems));
    }
  }, [cartItems, isOpen, findOverlappingStalls]);


  const BASE_BASALAM_URL = "https://basalam.com/p/"; // Mock Basalam product URL prefix

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" dir="rtl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">سبد خرید شما</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md"
            aria-label="بستن"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 py-10">سبد خرید شما خالی است. 🛒</p>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-4">اقلام سبد خرید:</h3>
            <div className="space-y-4 mb-8 border-b pb-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center flex-grow">
                    <img
                      src={`https://placehold.co/60x60/E5E7EB/4B5563?text=${item.product.name.replace(/ /g, '+')}`}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-md object-cover ml-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm">{item.product.price.toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="mx-2 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="mr-3 text-red-500 hover:text-red-700 transition duration-150"
                      aria-label="حذف محصول"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">غرفه‌هایی که همه محصولات سبد شما را دارند:</h3>
            {matchingStalls.length === 0 ? (
              <p className="text-gray-500 text-center py-4">هیچ غرفه‌ای همه محصولات انتخابی شما را موجود ندارد.</p>
            ) : (
              <div className="space-y-6">
                {matchingStalls.map((stall) => (
                  <div key={stall.vendor_id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-orange-800 mb-2">{stall.vendor_name}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {stall.products_in_cart.map((product) => (
                        <li key={product.id}>
                          <a
                            href={`${BASE_BASALAM_URL}${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:underline"
                          >
                            {product.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 mt-8">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-4">
                <span>جمع کل سبد خرید:</span>
                <span>{totalAmount.toLocaleString('fa-IR')} تومان</span>
              </div>
              <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition duration-300 shadow-lg">
                ادامه خرید
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// --- hooks/useProducts.js ---
// Mock product data
const MOCK_PRODUCTS = [
  { id: '1', name: 'توپ فوتبال نایک', description: 'توپ فوتبال سایز ۵ برای بازی در چمن', price: 750000 },
  { id: '2', name: 'کفش ورزشی آدیداس', description: 'کفش دویدن مناسب برای هر دویدن', price: 1200000 },
  { id: '3', name: 'راکت تنیس ویلسون', description: 'راکت سبک و قدرتمند برای بازیکنان نیمه حرفه ای', price: 980000 },
  { id: '4', name: 'لباس ورزشی نایک', description: 'تیشرت ورزشی تنفسی مناسب برای تمرین', price: 300000 },
  { id: '5', name: 'حلقه شنا اینتکس', description: 'حلقه بادی برای شنا در استخر', price: 120000 },
  { id: '6', name: 'دمبل ۲۰ کیلوگرمی', description: 'دمبل قابل تنظیم برای تمرینات قدرتی', price: 850000 },
  { id: '7', name: 'تشک یوگا', description: 'تشک ضد لغزش برای تمرینات یوگا و پیلاتس', price: 250000 },
  { id: '8', name: 'توپ بسکتبال اسپالدینگ', description: 'توپ بسکتبال استاندارد سایز ۷', price: 500000 },
  { id: '9', name: 'شورت ورزشی', description: 'شورت راحت برای انواع فعالیت های ورزشی', price: 180000 },
  { id: '10', name: 'بطری آب ورزشی', description: 'بطری آب با ظرفیت ۷۵۰ میلی لیتر', price: 90000 },
  { id: '11', name: 'دستکش بدنسازی', description: 'دستکش مقاوم برای حفاظت از دست در تمرینات', price: 200000 },
  { id: '12', name: 'تردمیل خانگی', description: 'تردمیل جمع و جور برای ورزش در خانه', price: 15000000 },
  { id: '13', name: 'کلاه شنا', description: 'کلاه سیلیکونی برای حفاظت مو در آب', price: 70000 },
  { id: '14', name: 'عینک شنا', description: 'عینک ضد بخار با دید وسیع', price: 150000 },
  { id: '15', name: 'کیسه بوکس', description: 'کیسه بوکس سنگین برای تمرینات رزمی', price: 2500000 },
  { id: '16', name: 'بارفیکس دیواری', description: 'بارفیکس قابل نصب بر روی دیوار', price: 400000 },
  { id: '17', name: 'اسکیت برد', description: 'اسکیت برد حرفه ای برای مبتدیان و حرفه ای ها', price: 1800000 },
  { id: '18', name: 'اسکیت کفشی', description: 'اسکیت کفشی با چرخ های روان', price: 2000000 },
  { id: '19', name: 'مچ بند طبی', description: 'مچ بند حمایتی برای جلوگیری از آسیب دیدگی', price: 100000 },
  { id: '20', name: 'زانو بند ورزشی', description: 'زانو بند فشرده سازی برای حمایت از زانو', price: 130000 },
];

/**
 * Custom hook for fetching and managing product data with pagination and search.
 * @param {string} searchTerm - The search term to filter products.
 */
function useProducts(searchTerm) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const productsPerPage = 8; // Number of products to load per page

  // Effect to load products when searchTerm or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredProducts = MOCK_PRODUCTS;

      // Apply search filter if searchTerm is not empty
      if (searchTerm) {
        filteredProducts = MOCK_PRODUCTS.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setTotalCount(filteredProducts.length);

      // Fetch products for the current page only
      const startIndex = (page - 1) * productsPerPage;
      const currentPageProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

      setProducts(prevProducts => {
        // Concatenate new products with previous ones, ensuring no duplicates
        const uniqueNewProducts = currentPageProducts.filter(newProd =>
          !prevProducts.some(p => p.id === newProd.id)
        );
        return [...prevProducts, ...uniqueNewProducts];
      });
      setHasMore(products.length + currentPageProducts.length < filteredProducts.length); // Corrected hasMore logic
      setLoading(false);
    };

    // Reset products and page when search term changes, then fetch first page
    if (page === 1) { // Only reset if it's the first page load for a new search term
      setProducts([]);
      setHasMore(true);
      setTotalCount(0);
    }
    fetchProducts();
  }, [searchTerm, page]); // Dependency array: re-run when searchTerm or page changes

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]); // Dependencies for useCallback

  return { products, loading, hasMore, loadMore, totalCount };
}

// --- App.jsx ---
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  // State to hold selected products for multi-selection search
  const [selectedProducts, setSelectedProducts] = useState([]);
  // State to hold items actually in the shopping cart
  const [cartItems, setCartItems] = useState([]);
  // State to control visibility of the cart modal
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const { products, loading, hasMore, loadMore, totalCount } = useProducts(searchTerm);

  // Function to add a product to the selected list for search
  const handleProductSelect = useCallback((productToAdd) => {
    setSelectedProducts((prevSelected) => {
      if (!prevSelected.some(p => p.id === productToAdd.id)) {
        return [...prevSelected, productToAdd];
      }
      return prevSelected;
    });
  }, []);

  // Function to remove a product from the selected list for search
  const handleProductDeselect = useCallback((productIdToRemove) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((p) => p.id !== productIdToRemove)
    );
  }, []);

  // Function to add all currently selected products to the cart
  const handleAddSelectedToCart = useCallback(() => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      selectedProducts.forEach((productToAdd) => {
        const existingItem = newCartItems.find(item => item.product.id === productToAdd.id);
        if (existingItem) {
          existingItem.quantity += 1; // Increase quantity if already in cart
        } else {
          newCartItems.push({ product: productToAdd, quantity: 1 }); // Add new item with quantity 1
        }
      });
      return newCartItems;
    });
    setSelectedProducts([]); // Clear selected products after adding to cart
  }, [selectedProducts]);

  // Function to update quantity of an item in the cart
  const handleUpdateCartQuantity = useCallback((productId, newQuantity) => {
    setCartItems((prevCartItems) => {
      return prevCartItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 } : item
      );
    });
  }, []);

  // Function to remove an item from the cart
  const handleRemoveFromCart = useCallback((productIdToRemove) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.product.id !== productIdToRemove)
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center flex-grow" dir="rtl">
            باسلام 🛍️
          </h1>
          <button
            onClick={() => setIsCartModalOpen(true)}
            className="relative bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-300 flex items-center"
            dir="rtl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 9.13a1 1 0 00.95.69h10.042a1 1 0 00.949-.69l1.351-9.13a1 1 0 00.01-.042F17.77 3 16.704 3H3z" />
            </svg>
            <span>سبد خرید</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Selected Products Display */}
        <SelectedProductsDisplay
          selectedProducts={selectedProducts}
          onProductRemove={handleProductDeselect}
          onAddSelectedToCart={handleAddSelectedToCart}
        />

        {/* Results Summary */}
        <div className="mb-6 text-right" dir="rtl">
          <p className="text-gray-600">
            {searchTerm ? (
              <>نمایش {totalCount.toLocaleString('fa-IR')} نتیجه برای "{searchTerm}"</>
            ) : (
              <>نمایش همه محصولات ({totalCount.toLocaleString('fa-IR')} محصول)</>
            )}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          selectedProducts={selectedProducts}
          onProductSelect={handleProductSelect}
          onProductDeselect={handleProductDeselect}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600" dir="rtl">
          <p>&copy; ۱۴۰۴ باسلام. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  );
}

export default App;
