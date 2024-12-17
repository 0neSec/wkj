import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService, Product } from '../../../services/product/product.service'; // Adjust import path as needed
import { productCategoryService } from '../../../services/product/product-category.service';

// Categories
const categories = [
  'All',
  'Herbal Drinks',
  'Herbal Supplements',
  'Herbal Teas',
  'Traditional Mixtures'
];

// Pagination Options
const paginationOptions = [10, 25, 50, 100];

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <img 
        src={`${process.env.REACT_APP_API_URL}${product.image}`} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold text-lg">
            Rp {product.price.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Product Listing Component
interface ProductListProps {
  isHomePage?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ isHomePage = false }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(isHomePage ? 6 : 12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await productService.getAllProductsWithCategories();
        const fetchedCategories = await productCategoryService.getAllProductCategories();
        setCategories([
          'All', 
          ...fetchedCategories.map(category => category.name)
        ]);
        setProducts(fetchedProducts);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => 
    (isHomePage ? true : 
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (selectedCategory === 'All' || product.product_category_name === selectedCategory))
  ));

  // Pagination Calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    isHomePage ? 0 : indexOfFirstProduct, 
    isHomePage ? 6 : indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Pagination Change Handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleProductsPerPageChange = (number: number) => {
    setProductsPerPage(number);
    setCurrentPage(1); // Reset to first page when changing products per page
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl">Loading products...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {!isHomePage && (
        <div className="flex mb-8">
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="md:hidden mr-4 text-gray-700"
          >
            <Filter size={24} />
          </button>

          {/* Search Input */}
          <div className="flex-grow relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full px-4 py-2 border rounded-full pl-10"
            />
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        {!isHomePage && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 pr-8">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-4 py-2 rounded-lg mb-2 ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-blue-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween' }}
                  className="absolute left-0 top-0 w-64 h-full bg-white shadow-2xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Categories</h3>
                    <button onClick={() => setIsSidebarOpen(false)}>
                      <X size={24} />
                    </button>
                  </div>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsSidebarOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-lg mb-2 ${
                        selectedCategory === category 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Product Grid */}
        <div className={`${!isHomePage ? 'md:w-[calc(100%-16rem)]' : 'w-full'}`}>
          {/* If no products found */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls (only for product page, not home page) */}
              {!isHomePage && totalPages > 1 && (
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
                  {/* Products Per Page Selector */}
                  <div className="mb-4 md:mb-0">
                    <label htmlFor="products-per-page" className="mr-2">
                      Products per page:
                    </label>
                    <select
                      id="products-per-page"
                      value={productsPerPage}
                      onChange={(e) => handleProductsPerPageChange(Number(e.target.value))}
                      className="border rounded px-2 py-1"
                    >
                      {paginationOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pagination Navigation */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 border rounded ${
                          currentPage === index + 1 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;