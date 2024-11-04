import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../services/product/product.service";

interface ProductGridProps {
  showSearch?: boolean;
  maxItems?: number;
  showSort?: boolean;
  showPagination?: boolean;
  className?: string;
  itemsPerPage?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  showSearch = true,
  maxItems,
  showSort = true,
  showPagination = false,
  itemsPerPage = 20,
  className = "",
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price-low" | "price-high">("price-low");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/product`);
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData = await productsResponse.json();
        const filteredProductsData = productsData.Products?.filter((product: Product) => product.category_name !== "Uncategorized") || [];
        setProducts(filteredProductsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category_name === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
    const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
    return sortBy === 'price-low' ? priceA - priceB : priceB - priceA;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = maxItems
    ? sortedProducts.slice(0, maxItems)
    : sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === "number" ? price : parseFloat(price) || 0;
    return !isNaN(numericPrice) ? `Rp ${numericPrice.toLocaleString()}` : "Price not available";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <div className={`${className} container mx-auto px-4 sm:px-6 lg:px-8 mt-10`}>
      <div className="flex flex-col sm:flex-row gap-6">

        {/* Main Products Section */}
        <div className="flex-grow">
          <div className="flex flex-col gap-6">
            {/* Search and Sort Section */}
            {(showSearch || showSort) && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {showSearch && (
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}
                {showSort && (
                  <select
                    className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "price-low" | "price-high")}
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                )}
              </div>
            )}

            {/* Products Grid */}
            {displayedProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">No products found matching your criteria.</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}${product.image_url}`}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                      <p className="text-gray-700">{formatPrice(product.price)}</p>
                      <button
                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => navigate(`/layanan/produk-layanan/${product.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Section */}
            {showPagination && totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
