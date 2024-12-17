import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Search, Menu, X } from "lucide-react";
import Sidebar from "../../../../component/sidebar";
import { CreateProductCategoryData, ProductCategory, productCategoryService } from "../../../../services/product/product-category.service";

const DashboardProductCategoryPage: React.FC = () => {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProductCategory, setCurrentProductCategory] = useState<Partial<ProductCategory>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Fetch product categories function
  const fetchProductCategories = async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await productCategoryService.getAllProductCategories();
      setProductCategories(fetchedCategories);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch product categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductCategories();
  }, []);

  // Handle toggling sidebar and mobile menu
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleAddProductCategory = () => {
    setCurrentProductCategory({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditProductCategory = (category: ProductCategory) => {
    setCurrentProductCategory(category);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveProductCategory = async () => {
    try {
      const categoryToSave = { ...currentProductCategory } as CreateProductCategoryData;

      if (isEditing && currentProductCategory.id) {
        await productCategoryService.updateProductCategory({
          id: currentProductCategory.id,
          ...categoryToSave
        });
      } else {
        await productCategoryService.createProductCategory(categoryToSave);
      }
      setIsModalOpen(false);
      // Refetch categories after save
      await fetchProductCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save product category");
    }
  };

  const handleDeleteProductCategory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await productCategoryService.deleteProductCategory(id);
        setProductCategories(productCategories.filter((category) => category.id !== id));
      } catch (err: any) {
        alert(err.message || "Failed to delete product category");
      }
    }
  };

  const filteredProductCategories = productCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading product categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <button 
          onClick={toggleMobileMenu} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-xl font-bold text-gray-800">Product Category Management</h1>
        <button
          onClick={handleAddProductCategory}
          className="text-green-600 hover:bg-green-50 p-2 rounded-lg"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto">
          <Sidebar />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Product Category Management</h1>
            <button
              onClick={handleAddProductCategory}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Category
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 px-4 py-2 border rounded-lg w-full focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Product Categories Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Category Name</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductCategories.map((category) => (
                  <tr key={category.id} className="border-t">
                    <td className="px-4 py-3 text-sm md:text-base">{category.name}</td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEditProductCategory(category)}
                        className="text-blue-500 hover:underline text-sm md:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProductCategory(category.id)}
                        className="text-red-500 hover:underline text-sm md:text-base"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-auto my-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Scrollable Content Container */}
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <h2 className="text-lg md:text-xl font-bold mb-6 sticky top-0 bg-white z-10 pb-2 border-b">
                {isEditing ? "Edit Product Category" : "Add Product Category"}
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">Category Name</label>
                  <input
                    type="text"
                    value={currentProductCategory.name || ""}
                    onChange={(e) =>
                      setCurrentProductCategory({
                        ...currentProductCategory,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter category name"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                  />
                </div>

                {/* Action Buttons - Sticky at bottom */}
                <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProductCategory}
                    className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProductCategoryPage;
