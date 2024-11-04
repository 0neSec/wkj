import React, { useEffect, useState } from "react";
import Navbar from "../../../../component/includes/navbar";
import Sidebar from "../../../../component/includes/sidebar";
import {
  Product,
  CreateProductData,
  UpdateProductData,
  productService,
} from "../../../../services/product/product.service";
import {
  ProductCategory,
  productCategoryService,
} from "../../../../services/product/product-category.service";
import ArrayInput from "../../../../component/includes/product/Array";

const DashboardProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateProductData>>({
    name: "",
    latin_name: "",
    synonym: "",
    familia: "",
    part_used: "",
    method_of_reproduction: "",
    harvest_age: "",
    morphology: "",
    area_name: "",
    efficacy: "",
    research_results: "",
    description: "",
    price: 0,
    unit_type: "",
    product_category_id: "",
    utilization: [],
    composition: [],
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsData = await productService.getAllProducts();
        const categoriesData = await productCategoryService.getAllCategories();

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else if (categoriesData && typeof categoriesData === "object") {
          const categoryArrayKey = Object.keys(categoriesData).find((key) =>
            Array.isArray((categoriesData as any)[key])
          );
          if (categoryArrayKey) {
            setCategories((categoriesData as any)[categoryArrayKey]);
          }
        }

        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAllProductsWithCategories(),
        productCategoryService.getAllCategories(),
      ]);

      const productsData = Array.isArray(productsResponse)
        ? productsResponse
        : [];
      const categoriesData = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : [];

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data.");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleArrayInputChange = (
    name: "utilization" | "composition",
    value: string
  ) => {
    try {
      const arrayValue = JSON.parse(value);
      if (Array.isArray(arrayValue)) {
        setFormData((prev) => ({
          ...prev,
          [name]: arrayValue,
        }));
      }
    } catch (e) {
      console.error(`Invalid ${name} format`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      latin_name: "",
      synonym: "",
      familia: "",
      part_used: "",
      method_of_reproduction: "",
      harvest_age: "",
      morphology: "",
      area_name: "",
      efficacy: "",
      research_results: "",
      description: "",
      price: 0,
      unit_type: "",
      product_category_id: "",
      utilization: [],
      composition: [],
    });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleCreateProduct = async () => {
    if (!formData.name?.trim()) {
      alert("Product name cannot be empty");
      return;
    }
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }
    try {
      const createData = {
        ...formData,
        image: selectedFile,
        product_category_id: formData.product_category_id || undefined,
      } as CreateProductData;

      await productService.createProduct(createData);
      resetForm();
      setIsModalOpen(false);
      await fetchInitialData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create product."
      );
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const updateData: UpdateProductData = {
        id: editingProduct.id,
        ...formData,
        product_category_id: formData.product_category_id || undefined,
      };

      if (selectedFile) {
        updateData.image = selectedFile;
      }

      await productService.updateProduct(updateData);
      resetForm();
      setIsModalOpen(false);
      await fetchInitialData();
    } catch (err) {
      let errorMessage = "Failed to update product.";
      if (err instanceof Error) {
        if (err.message.includes("Conflict")) {
          errorMessage =
            "Conflict with existing product data. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await productService.deleteProduct(productId);
        await fetchInitialData();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete product."
        );
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      latin_name: product.latin_name,
      synonym: product.synonym,
      familia: product.familia,
      part_used: product.part_used,
      method_of_reproduction: product.method_of_reproduction,
      harvest_age: product.harvest_age,
      morphology: product.morphology,
      area_name: product.area_name,
      efficacy: product.efficacy,
      research_results: product.research_results,
      description: product.description,
      price: product.price,
      unit_type: product.unit_type,
      product_category_id: product.product_category_id,
      utilization: product.utilization || [],
      composition: product.composition || [],
    });
    setImagePreview(product.image_url || null);
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
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Latin Name</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{product.id}</td>
                      <td className="px-4 py-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.latin_name}</td>
                      <td className="px-4 py-3">
                        ${Number(product.price).toFixed(2)}
                      </td>
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
                      <td
                        colSpan={7}
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 max-w-[90vw] sm:max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </h2>

                  {/* Image Upload Section */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Product Image</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-1/3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="border rounded-lg w-full p-2"
                        />
                      </div>
                      {imagePreview && (
                        <div className="w-full sm:w-1/3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {editingProduct && editingProduct.image_url && !imagePreview && (
                        <div className="w-full sm:w-1/3">
                          <img
                            src={editingProduct.image_url}
                            alt="Current"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <p className="text-sm text-gray-500 mt-1">Current image</p>
                        </div>
                      )}
                    </div>
                    {!selectedFile && !editingProduct && (
                      <p className="text-sm text-red-500 mt-1">
                        Please select an image for the product
                      </p>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700">Latin Name</label>
                      <input
                        type="text"
                        name="latin_name"
                        value={formData.latin_name}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700">Synonym</label>
                      <input
                        type="text"
                        name="synonym"
                        value={formData.synonym}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Familia</label>
                      <input
                        type="text"
                        name="familia"
                        value={formData.familia}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700">Part Used</label>
                      <input
                        type="text"
                        name="part_used"
                        value={formData.part_used}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Method of Reproduction
                      </label>
                      <input
                        type="text"
                        name="method_of_reproduction"
                        value={formData.method_of_reproduction}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700">Harvest Age</label>
                      <input
                        type="text"
                        name="harvest_age"
                        value={formData.harvest_age}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Morphology</label>
                      <input
                        type="text"
                        name="morphology"
                        value={formData.morphology}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700">Area Name</label>
                      <input
                        type="text"
                        name="area_name"
                        value={formData.area_name}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Efficacy</label>
                      <input
                        type="text"
                        name="efficacy"
                        value={formData.efficacy}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
                      />
                    </div>
                  </div>

                  {/* Research Results & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700">Research Results</label>
                      <textarea
                        name="research_results"
                        value={formData.research_results}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2 h-32"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2 h-32"
                      />
                    </div>
                  </div>

                  {/* Array Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ArrayInput
                      label="Utilization"
                      value={formData.utilization}
                      onChange={(newValue) =>
                        setFormData((prev) => ({
                          ...prev,
                          utilization: newValue,
                        }))
                      }
                      placeholder="Enter a utilization"
                    />
                    <ArrayInput
                      label="Composition"
                      value={formData.composition}
                      onChange={(newValue) =>
                        setFormData((prev) => ({
                          ...prev,
                          composition: newValue,
                        }))
                      }
                      placeholder="Enter a composition"
                    />
                  </div>

                  {/* Price and Category Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      <label className="block text-gray-700">Unit Type</label>
                      <input
                        type="text"
                        name="unit_type"
                        value={formData.unit_type}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full p-2"
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
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={
                        editingProduct
                          ? handleUpdateProduct
                          : handleCreateProduct
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      {editingProduct ? "Update Product" : "Create Product"}
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