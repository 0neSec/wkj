import React, { useEffect, useState } from "react";
import {
  Product,
  productService,
} from "../../../services/product/product.service";
import { Search } from "lucide-react";

interface ProductPageProps {
  showSearchAndFilter?: boolean;
}

const ProductPage: React.FC<ProductPageProps> = ({
  showSearchAndFilter = true,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("name");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productList = await productService.getAllProducts();
        setProducts(productList);
        setFilteredProducts(productList);

        const uniqueCategories = Array.from(
          new Set(
            productList
              .map((product) => product.category_name)
              .filter(
                (category): category is string =>
                  category !== undefined && category !== null
              )
          )
        ).sort();

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (term: string, category: string) => {
    let filtered = products;

    if (term) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.latin_name.toLowerCase().includes(term.toLowerCase()) ||
          (product.category_name?.toLowerCase() || "").includes(
            term.toLowerCase()
          )
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(
        (product) => product.category_name === category
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSortBy(value);
    filterProducts(searchTerm, selectedCategory);
  };

  const handleMessageClick = (product: Product) => {
    console.log(`Message clicked for product: ${product.name}`);
  };

  const handleDetailsClick = (product: Product) => {
    console.log(`Details clicked for product: ${product.name}`);
  };

  return (
    <div className="p-4">
      {/* Conditionally render search and filter section */}
      {showSearchAndFilter && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative group">
                <div className="overflow-hidden relative pb-[75%]">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${product.image_url}`}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="p-6">
                {product.category_name && (
                  <div className="text-xs font-medium text-blue-600 mb-1">
                    {product.category_name}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 italic mb-2">
                  {product.latin_name}
                </p>
                <span className="text-xl font-bold text-gray-900 block mb-4">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() =>
                    (window.location.href = `/layanan/produk-layanan/${product.id}`)
                  }
                  className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
