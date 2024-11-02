import React, { useEffect, useState } from 'react';
import Navbar from '../../../../component/includes/navbar';
import Sidebar from '../../../../component/includes/sidebar';
import { layananCategoryService, ServiceCategory } from '../../../../services/Layanan/LayananCategory';

interface ApiServiceCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface CreateServiceCategoryPayload {
  name: string;
}

interface UpdateServiceCategoryPayload {
  id: string;
  name: string;
}

const DashboardServiceCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ApiServiceCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Rest of the state management and functions remain the same...
  // Including fetchCategories, handleCreateCategory, handleUpdateCategory, handleDeleteCategory

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await layananCategoryService.getAllServiceCategories();
      
      if ('ServiceCategory' in response && Array.isArray(response.ServiceCategory)) {
        const transformedCategories: ApiServiceCategory[] = response.ServiceCategory.map((category: ServiceCategory) => ({
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setCategories(transformedCategories);
      } else if (Array.isArray(response)) {
        const transformedCategories: ApiServiceCategory[] = response.map((category: ServiceCategory) => ({
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setCategories(transformedCategories);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load service categories";
      setError(errorMessage);
      setIsErrorModalOpen(true);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty");
      setIsErrorModalOpen(true);
      return;
    }
  
    const payload: CreateServiceCategoryPayload = {
      name: newCategoryName.trim()
    };
  
    try {
      const response = await layananCategoryService.createServiceCategory(payload);
      if (response) {
        const currentTime = new Date().toISOString();
        const newCategory: ApiServiceCategory = {
          id: response.id || String(Date.now()),
          name: newCategoryName.trim(),
          created_at: currentTime,
          updated_at: currentTime
        };
        
        setCategories(prevCategories => [newCategory, ...prevCategories]);
        setSuccessMessage("Category created successfully");
        setIsSuccessModalOpen(true);
        setNewCategoryName("");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error creating category:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create category";
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    const newName = newCategoryName.trim();
    if (!newName) {
      setError("Category name cannot be empty");
      setIsErrorModalOpen(true);
      return;
    }

    const payload: UpdateServiceCategoryPayload = {
      id: editingCategory.id,
      name: newName
    };

    try {
      const updatedCategory = await layananCategoryService.updateServiceCategory(payload);
      if (updatedCategory) {
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? { ...cat, name: newName } : cat
        ));
        setSuccessMessage("Category updated successfully");
        setIsSuccessModalOpen(true);
        setEditingCategory(null);
        setNewCategoryName("");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating category:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update category";
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const handleDeleteCategory = async (category: ApiServiceCategory) => {
    try {
      await layananCategoryService.deleteServiceCategory(category.id);
      setCategories(prev => prev.filter(cat => cat.id !== category.id));
      setSuccessMessage("Category deleted successfully");
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Error deleting category:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete category";
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Service Categories</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingCategory(null);
                  setNewCategoryName("");
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

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Created At</th>
                    <th className="px-4 py-3 text-left">Updated At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, index) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{category.name}</td>
                      <td className="px-4 py-3">{new Date(category.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{new Date(category.updated_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setNewCategoryName(category.name);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
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

            {/* Modals remain the same */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </h2>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category Name"
                    className="border px-4 py-2 rounded-lg mb-4 w-full"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        editingCategory ? handleUpdateCategory() : handleCreateCategory();
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

            {isSuccessModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Success</h2>
                  <p className="mb-4">{successMessage}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsSuccessModalOpen(false);
                        setSuccessMessage(null);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isErrorModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Error</h2>
                  <p className="mb-4">{error}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsErrorModalOpen(false);
                        setError(null);
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

export default DashboardServiceCategoryPage;