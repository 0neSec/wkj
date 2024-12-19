import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  productService,
  Product,
} from "../../../services/product/product.service";
import { productCategoryService } from "../../../services/product/product-category.service";
import { useNavigate } from "react-router-dom";

// Pagination Options
const paginationOptions = [10, 25, 50, 100];

type OnDetailClickType = (productOrId: Product | number) => void;

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  onDetailClick: OnDetailClickType;
}> = ({ product, onDetailClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <img
        src={`${process.env.REACT_APP_API_URL}${product.image}`}
        alt={product.name}
        className="w-full h-36 sm:h-44 md:h-48 object-cover"
      />
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-gray-800">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          {product.description.length > 50
            ? `${product.description.slice(0, 50)}...`
            : product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold text-sm sm:text-lg">
            Rp {product.price.toLocaleString()}
          </span>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => onDetailClick(product.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-green-700 transition flex items-center text-xs sm:text-sm"
            >
              <Eye size={14} className="mr-1" /> Detail
            </motion.button>
          </div>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(isHomePage ? 6 : 12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts =
          await productService.getAllProductsWithCategories();
        const fetchedCategories =
          await productCategoryService.getAllProductCategories();
        setCategories([
          "All",
          ...fetchedCategories.map((category) => category.name),
        ]);
        setProducts(fetchedProducts);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Failed to load products. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter((product) =>
    isHomePage
      ? true
      : product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" ||
          product.product_category_name === selectedCategory)
  );

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

  
  const handleProductDetail = (productOrId: Product | number) => {
    if (typeof productOrId === "number") {
      // Navigate to product detail page
      navigate(`/product/${productOrId}`);
    } else {
      // If you still want to keep the old modal logic
      setSelectedProduct(productOrId);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
        <p className="text-base sm:text-xl">Loading products...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
        <p className="text-base sm:text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {!isHomePage && (
        <div className="flex flex-col sm:flex-row mb-6 sm:mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden self-start text-gray-700"
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
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-full pl-8 sm:pl-10 text-sm sm:text-base"
            />
            <Search
              size={16}
              className="absolute left-2 sm:left-3 top-3 text-gray-400"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        {!isHomePage && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 pr-8">
              <h3 className="text-base sm:text-xl font-bold mb-4">
                Categories
              </h3>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg mb-2 text-sm sm:text-base ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-50"
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
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween" }}
                  className="absolute left-0 top-0 w-64 h-full bg-white shadow-2xl p-4 sm:p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-xl font-bold">
                      Categories
                    </h3>
                    <button onClick={() => setIsSidebarOpen(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsSidebarOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg mb-2 text-sm sm:text-base ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-50"
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
        <div
          className={`w-full ${!isHomePage ? "md:w-[calc(100%-16rem)]" : ""}`}
        >
          {/* If no products found */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-base sm:text-xl text-gray-500">
                No products found
              </p>
            </div>
          ) : (
            <>
              {/* Product Grid - Modified to 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDetailClick={handleProductDetail}
                  />
                ))}
              </div>

              {/* Pagination Controls (only for product page, not home page) */}
              {!isHomePage && totalPages > 1 && (
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  {/* Products Per Page Selector */}
                  <div className="w-full md:w-auto text-center md:text-left">
                    <label
                      htmlFor="products-per-page"
                      className="mr-2 text-sm sm:text-base"
                    >
                      Products per page:
                    </label>
                    <select
                      id="products-per-page"
                      value={productsPerPage}
                      onChange={(e) =>
                        handleProductsPerPageChange(Number(e.target.value))
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {paginationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pagination Navigation */}
                  <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 sm:px-4 sm:py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-2 py-1 sm:px-4 sm:py-2 border rounded text-xs sm:text-base ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 sm:px-4 sm:py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
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
