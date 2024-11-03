import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../services/product/product.service';

interface ProductGridProps {
  showSearch?: boolean;
  maxItems?: number;
  showCategories?: boolean;
  showSort?: boolean;
  showPagination?: boolean;
  className?: string;
  itemsPerPage?: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

// Helper function to safely parse price values
const getPriceValue = (price: number | string): number => {
  if (typeof price === 'number') return price;
  return parseFloat(price) || 0;
};

const createCategories = (products: Category[]): Category[] => {
  const categoryMap = new Map<string, number>();
  products.forEach(product => {
    const category = product.name || 'Uncategorized';
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  
  });
  
  return [
    { id: 'all', name: 'All Products', count: products.length },
    ...Array.from(categoryMap).map(([id, count]) => ({
      id,
      name: id,
      count
    }))
  
  ];
};

const formatPrice = (price: number | string): string => {
  const numericPrice = getPriceValue(price);
  return !isNaN(numericPrice) 
    ? `Rp ${numericPrice.toLocaleString()}`
    : 'Price not available';
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  showSearch = true,
  maxItems,
  showCategories = true,
  showSort = true,
  showPagination = false,
  itemsPerPage = 20,
  className = ""
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high'>('price-low');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/product`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const productsData = data.Products || [];
        setProducts(productsData);
        setCategories(createCategories(productsData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
  .filter(product => {
    const matchesSearch = !showSearch || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === 'all' || 
      product.product_category_id === selectedFilter;
    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    const priceA = getPriceValue(a.price);
    const priceB = getPriceValue(b.price);
    
    if (isNaN(priceA) || isNaN(priceB)) return 0;
    return sortBy === 'price-low' ? priceA - priceB : priceB - priceA;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = maxItems 
    ? filteredProducts.slice(0, maxItems) 
    : filteredProducts.slice(startIndex, endIndex);

  const handleProductClick = (productId?: string) => {
    if (productId) {
      navigate(`/layanan/produk-layanan/${productId}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  const CategorySidebar: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full md:w-64 flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="flex flex-col gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-lg text-left transition-colors ${
              selectedFilter === category.name
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => {
              setSelectedFilter(category.name);
              setIsMobileFiltersOpen(false);
            }}
          >
            <span className="flex justify-between items-center">
              {category.name}
              <span className="text-sm">({category.count})</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div 
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={() => handleProductClick(product.id)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={`${process.env.REACT_APP_API_URL}${product.image_url}` }
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          {product.product_category_id && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {product.product_category_id}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || 'No description available'}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          {isMobileFiltersOpen ? 'Close Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - Mobile */}
        {showCategories && isMobileFiltersOpen && (
          <div className="md:hidden">
            <CategorySidebar />
          </div>
        )}

        {/* Sidebar - Desktop */}
        {showCategories && (
          <div className="hidden md:block">
            <CategorySidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort */}
          {(showSearch || showSort) && (
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {showSearch && (
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
              
              {showSort && (
                <select
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price-low' | 'price-high')}
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              )}
            </div>
          )}

          {/* Products Grid */}
          {displayedProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;