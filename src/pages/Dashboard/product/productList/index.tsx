import React, { useEffect, useState } from "react";
import Navbar from "../../../../component/includes/navbar";
import Sidebar from "../../../../component/includes/sidebar";
import {
  Product,
  CreateProductData,
  UpdateProductData,
  productService,
} from "../../../../services/product/product.service";
import { ProductCategory, productCategoryService } from "../../../../services/product/product-category.service";

const DashboardProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<CreateProductData>>({
    name: "",
    price: 0,
    description: "",
    product_category_id: "",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProductsWithCategories(),
        productCategoryService.getAllCategories(),
      ]);

      console.log('Products with categories:', productsData);
      console.log('Categories:', categoriesData);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      product_category_id: "",
    });
    setSelectedFile(null);
    setEditingProduct(null);
  };

  const handleCreateProduct = async () => {
    if (!formData.name?.trim()) {
      alert("Product name cannot be empty");
      return;
    }

    if (!formData.product_category_id) {
      alert("Please select a category");
      return;
    }

    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    try {
      const createData: CreateProductData = {
        name: formData.name,
        price: formData.price || 0,
        description: formData.description || "",
        image: selectedFile,
        product_category_id: formData.product_category_id,
      };

      await productService.createProduct(createData);
      resetForm();
      setIsModalOpen(false);
      await fetchInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product.");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    if (!formData.product_category_id) {
      alert("Please select a category");
      return;
    }

    try {
      const updateData: UpdateProductData = {
        id: editingProduct.id,
        name: formData.name,
        price: formData.price || 0,
        description: formData.description,
        product_category_id: formData.product_category_id,
      };

      if (selectedFile) {
        updateData.image = selectedFile;
      }

      await productService.updateProduct(updateData);
      resetForm();
      setIsModalOpen(false);
      await fetchInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await productService.deleteProduct(productId);
        await fetchInitialData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete product.");
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price || 0,
      description: product.description,
      product_category_id: product.product_category_id,
    });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Product List</h1>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New Product
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
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
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{product.id}</td>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">${Number(product.price).toFixed(2)}</td>
                      <td className="px-4 py-3">{product.category_name}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                  <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
                  <div className="mb-4">
                    <label className="block text-gray-700">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border rounded-lg w-full p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="border rounded-lg w-full p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="border rounded-lg w-full p-2"
                      rows={3}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Category</label>
                    <select
                      name="product_category_id"
                      value={formData.product_category_id}
                      onChange={handleInputChange}
                      className="border rounded-lg w-full p-2"
                    >
                      <option value="">Select category</option>
                      {products.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category_name }
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Image</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="border rounded-lg w-full p-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      {editingProduct ? "Update" : "Create"}
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

export default DashboardProduct;
