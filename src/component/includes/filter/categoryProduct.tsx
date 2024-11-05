import React, { useState, useEffect } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  ProductCategory,
  productCategoryService,
} from "../../../services/product/product-category.service";

interface CategorySidebarProps {
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  className?: string;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategoryId,
  onCategorySelect,
  className = "",
}) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await productCategoryService.getProductCategories();
        console.log(data);
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 text-center">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Mobile Toggle */}
      <div className="lg:hidden p-4 border-b">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-semibold">Categories</span>
          <ChevronRight
            className={`w-5 h-5 transition-transform ${
              isCollapsed ? "" : "rotate-90"
            }`}
          />
        </button>
      </div>

      {/* Category List */}
      <div className={`${isCollapsed ? "hidden" : "block"} lg:block`}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 hidden lg:block">
            Categories
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => onCategorySelect(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategoryId === null
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id.toString())} // Convert to string
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategoryId === category.id.toString() // Convert to string for comparison
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
