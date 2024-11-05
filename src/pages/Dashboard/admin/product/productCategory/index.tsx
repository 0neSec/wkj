import React, { useState, useEffect } from 'react';
import { CreateProductCategoryData, ProductCategory, productCategoryService, UpdateProductCategoryData } from '../../../../../services/product/product-category.service';
import Navbar from '../../../../../component/includes/navbar';
import Sidebar from '../../../../../component/includes/sidebar';
import { Menu } from 'lucide-react';

const ProductCategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [newCategory, setNewCategory] = useState<CreateProductCategoryData>({ name: '' });
  const [editingCategory, setEditingCategory] = useState<UpdateProductCategoryData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await productCategoryService.getProductCategories();
      // Add type checking and ensure we're working with an array
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else if (categoriesData && typeof categoriesData === 'object') {
        // If the data is an object but not an array, it might be nested
        // Check common API response patterns
        const categoryArray = (categoriesData as any).data || 
                            (categoriesData as any).categories || 
                            Object.values(categoriesData);
        if (Array.isArray(categoryArray)) {
          setCategories(categoryArray);
        } else {
          console.error("Received data is not in the expected format:", categoriesData);
          setCategories([]);
        }
      } else {
        console.error("Received data is not in the expected format:", categoriesData);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };
  

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    try {
      await productCategoryService.createProductCategory(newCategory);
      setNewCategory({ name: '' });
      setSuccessMessage('Category created successfully');
      await fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      setError('Failed to create category');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      await productCategoryService.updateProductCategory(editingCategory);
      setEditingCategory(null);
      setSuccessMessage('Category updated successfully');
      await fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (confirmed) {
      try {
        await productCategoryService.deleteProductCategory(id);
        setSuccessMessage('Category deleted successfully');
        await fetchCategories();
      } catch (error) {
        setError('Failed to delete category');
      }
    }
  };

  const filteredCategories = Array.isArray(categories) 
  ? categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row mt-24">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 mt-4 md:mt-10">
          <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Product Category Management</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingCategory(null);
                  setNewCategory({ name: '' });
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New Category
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{category.id}</td>
                      <td className="px-4 py-3">
                        {editingCategory?.id === category.id ? (
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory({ id: editingCategory.id, name: e.target.value })
                            }
                            className="border px-2 py-1 rounded-lg w-full"
                          />
                        ) : (
                          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg truncate">
                          {category.name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editingCategory?.id === category.id ? (
                          <>
                            <button
                              onClick={handleUpdateCategory}
                              className="text-green-500 hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="ml-4 text-red-500 hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="ml-4 text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <input
                    type="text"
                    value={editingCategory ? editingCategory.name : newCategory.name}
                    onChange={(e) =>
                      editingCategory
                        ? setEditingCategory({ id: editingCategory.id, name: e.target.value })
                        : setNewCategory({ name: e.target.value })
                    }
                    placeholder="Enter category name..."
                    className="border px-4 py-2 rounded-lg w-full"
                  />
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        if (editingCategory) {
                          handleUpdateCategory();
                        } else {
                          handleCreateCategory();
                        }
                      }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {editingCategory ? 'Update' : 'Create'}
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="ml-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryManagementPage;
