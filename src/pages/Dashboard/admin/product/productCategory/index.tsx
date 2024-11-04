import React, { useEffect, useState } from "react";
import Navbar from "../../../../../component/includes/navbar";
import Sidebar from "../../../../../component/includes/sidebar";
import {
  ProductCategory,
  CreateCategoryData,
  UpdateCategoryData,
  productCategoryService,
} from "../../../../../services/product/product-category.service";
import { userFriendlyMessages } from "./types";

const DashboardProductCategory = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [newCategory, setNewCategory] = useState<CreateCategoryData>({ name: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categoryService = productCategoryService;

  const validateAndTransformCategories = (data: any): ProductCategory[] => {
    if (!data) return [];

    // Handle string response
    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? validateAndTransformCategories(parsedData) : [];
      } catch {
        console.error('Invalid JSON string received');
        return [];
      }
    }

    // Handle array response
    if (Array.isArray(data)) {
      return data.map(item => {
        // Handle primitive values
        if (typeof item === 'string' || typeof item === 'number') {
          return {
            id: typeof item === 'number' ? item : parseInt(item, 10) || Math.floor(Math.random() * 1000000),
            name: String(item)
          };
        }
        // Handle object values
        const itemId = item.id || item._id;
        return {
          id: typeof itemId === 'number' ? itemId : parseInt(String(itemId), 10) || Math.floor(Math.random() * 1000000),
          name: item.name || item.title || 'Unnamed Category'
        };
      });
    }

    // Handle single object response
    if (typeof data === 'object' && data !== null) {
      if (Object.keys(data).length === 0) return [];
      
      // If data is a single category object
      if (data.id || data._id || data.name) {
        const objId = data.id || data._id;
        return [{
          id: typeof objId === 'number' ? objId : parseInt(String(objId), 10) || Math.floor(Math.random() * 1000000),
          name: data.name || data.title || 'Unnamed Category'
        }];
      }

      // If data has nested properties that might contain categories
      const possibleArrays = Object.values(data).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        return validateAndTransformCategories(possibleArrays[0]);
      }
    }

    return [];
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        const transformedCategories = validateAndTransformCategories(response);
        setCategories(transformedCategories);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : userFriendlyMessages.LOAD_FAILED;
        setError(errorMessage);
        setIsErrorModalOpen(true); // Open error modal
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const refreshCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      const transformedCategories = validateAndTransformCategories(response);
      setCategories(transformedCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : userFriendlyMessages.LOAD_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true); // Open error modal
      console.error('Error refreshing categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert(userFriendlyMessages.EMPTY_NAME);
      return;
    }

    try {
      await categoryService.createCategory(newCategory);
      await refreshCategories();
      setSuccessMessage(userFriendlyMessages.CREATE_SUCCESS);
      setIsSuccessModalOpen(true); // Open success modal
      setNewCategory({ name: "" });
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : userFriendlyMessages.CREATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true); // Open error modal
      console.error('Error creating category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      try {
        await categoryService.deleteCategory(categoryId);
        await refreshCategories();
        setSuccessMessage(userFriendlyMessages.DELETE_SUCCESS);
        setIsSuccessModalOpen(true); // Open success modal
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : userFriendlyMessages.DELETE_FAILED;
        setError(errorMessage);
        setIsErrorModalOpen(true); // Open error modal
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const updatedData: UpdateCategoryData = {
        id: editingCategory.id.toString(), // Convert number to string here
        name: editingCategory.name,
      };
      await categoryService.updateCategory(updatedData);
      await refreshCategories();
      setSuccessMessage(userFriendlyMessages.UPDATE_SUCCESS);
      setIsSuccessModalOpen(true);
      setEditingCategory(null);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : userFriendlyMessages.UPDATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error('Error updating category:', err);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingCategory(null);
                  setNewCategory({ name: "" });
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New Category
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Category Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
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
                      <td className="px-4 py-3">{category.name}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id.toString())}
                          className="ml-4 text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal for Creating/Editing Category */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">{editingCategory ? "Edit Category" : "Add Category"}</h2>
                  <input
                    type="text"
                    value={editingCategory ? editingCategory.name : newCategory.name}
                    onChange={(e) => {
                      if (editingCategory) {
                        setEditingCategory({ ...editingCategory, name: e.target.value });
                      } else {
                        setNewCategory({ name: e.target.value });
                      }
                    }}
                    placeholder="Category Name"
                    className="border px-4 py-2 rounded-lg mb-4 w-full"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (editingCategory) {
                          handleUpdateCategory();
                        } else {
                          handleCreateCategory();
                        }
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      {editingCategory ? "Update" : "Create"}
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Modal */}
            {isSuccessModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Success</h2>
                  <p className="mb-4">{successMessage}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsSuccessModalOpen(false);
                        setSuccessMessage(null); // Clear success message after closing
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Modal */}
            {isErrorModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Error</h2>
                  <p className="mb-4">{error}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsErrorModalOpen(false);
                        setError(null); // Clear error message after closing
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductCategory;
