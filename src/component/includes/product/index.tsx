import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, productService } from '../../../services/product/product.service';

interface ProductGridProps {
  showSearch?: boolean;
  maxItems?: number;
  showCategories?: boolean;
  showSort?: boolean;
  showPagination?: boolean;
  className?: string;
  itemsPerPage?: number;
}

const createCategories = (products: Product[]) => {
  const categoryMap = new Map<string, number>();
  products.forEach(product => {
    const category = product.category_name || 'Uncategorized';
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  
  return [
    { id: 'all', name: 'Semua', count: products.length },
    ...Array.from(categoryMap).map(([name, count]) => ({
      id: name.toLowerCase(),
      name,
      count
    }))
  ];
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
  const [categories, setCategories] = useState<{ id: string; name: string; count: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productService.getAllProductsWithCategories();
        setProducts(productsData);
        setCategories(createCategories(productsData));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !showSearch || product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedFilter === 'all' || 
        (product.category_name?.toLowerCase() === selectedFilter);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = maxItems 
    ? filteredProducts.slice(0, maxItems) 
    : filteredProducts.slice(startIndex, endIndex);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
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

  const CategorySidebar = () => (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Kategori</h2>
        <div className="flex flex-col gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg text-left transition-colors ${
                selectedFilter === category.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setSelectedFilter(category.id);
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
          {isMobileFiltersOpen ? 'Tutup Filter' : 'Buka Filter'}
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
                    placeholder="Cari produk..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
              
              {showSort && (
                <div className="flex-shrink-0">
                  <select
                    className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="price-low">Harga: Rendah ke Tinggi</option>
                    <option value="price-high">Harga: Tinggi ke Rendah</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg hover:shadow-md transition-shadow duration-200 shadow-lg cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={`http://localhost:5000${product.image_url}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {product.category_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Rp {product.price.toLocaleString()}
                    </span>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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