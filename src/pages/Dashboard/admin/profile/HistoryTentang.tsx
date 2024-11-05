import React, { useState, useEffect } from 'react';
import Navbar from '../../../../component/includes/navbar';
import Sidebar from '../../../../component/includes/sidebar';
import { CreateProductCategoryData, ProductCategory, productCategoryService, UpdateProductCategoryData } from '../../../../services/product/product-category.service';

const ProductCategoryManagementPage = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [newCategory, setNewCategory] = useState<CreateProductCategoryData>({ name: '' });
  const [editingCategory, setEditingCategory] = useState<UpdateProductCategoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categories = await productCategoryService.getProductCategories();
      setCategories(categories);
    } catch (err) {
      setError('Failed to fetch product categories');
      setIsErrorModalOpen(true);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Category name cannot be empty');
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await productCategoryService.createProductCategory(newCategory);
      setNewCategory({ name: '' });
      setSuccessMessage('Product category created successfully');
      setIsSuccessModalOpen(true);
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create product category');
      setIsErrorModalOpen(true);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      await productCategoryService.updateProductCategory(editingCategory);
      setEditingCategory(null);
      setSuccessMessage('Product category updated successfully');
      setIsSuccessModalOpen(true);
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to update product category');
      setIsErrorModalOpen(true);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this product category?');
    if (confirmed) {
      try {
        await productCategoryService.deleteProductCategory(id);
        setSuccessMessage('Product category deleted successfully');
        setIsSuccessModalOpen(true);
        await fetchCategories();
      } catch (err: any) {
        setError(err.message || 'Failed to delete product category');
        setIsErrorModalOpen(true);
      }
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Product Category Management</h1>
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

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Created At</th>
                    <th className="px-4 py-3 text-left">Updated At</th>
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
                          category.name
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(category.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(category.updated_at).toLocaleString()}
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
                    {editingCategory ? 'Edit Product Category' : 'Add New Product Category'}
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingCategory ? editingCategory.name : newCategory.name}
                      onChange={(e) =>
                        editingCategory
                          ? setEditingCategory({ id: editingCategory.id, name: e.target.value })
                          : setNewCategory({ name: e.target.value })
                      }
                      placeholder="Enter category name..."
                      className="border px-4 py-3 rounded-lg w-full"
                    />
                  </div>
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

            {isSuccessModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Success</h2>
                  <p>{successMessage}</p>
                  <button
                    onClick={() => setIsSuccessModalOpen(false)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {isErrorModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Error</h2>
                  <p>{error}</p>
                  <button
                    onClick={() => setIsErrorModalOpen(false)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryManagementPage;