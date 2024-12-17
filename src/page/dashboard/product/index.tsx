import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Menu,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Sidebar from "../../../component/sidebar";
import {
  Product,
  CreateProductData,
  UpdateProductData,
  productService,
} from "../../../services/product/product.service";
import {
  productCategoryService,
  ProductCategory,
} from "../../../services/product/product-category.service";

const DashboardProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Fetch products and categories
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        productService.getAllProductsWithCategories(),
        productCategoryService.getAllProductCategories(),
      ]);
      setProducts(fetchedProducts);
      setProductCategories(fetchedCategories);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch products or categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle mobile menu and handle image selection
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Product CRUD operations
  const handleAddProduct = () => {
    setCurrentProduct({});
    setIsEditing(false);
    setIsModalOpen(true);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
    setSelectedImage(null);

    setImagePreview(typeof product.image === "string" ? product.image : null);
  };

  const handleSaveProduct = async () => {
    try {
      const productData: CreateProductData | UpdateProductData = {
        ...currentProduct,
        image: selectedImage || currentProduct.image,
        product_category_id: currentProduct.product_category_id,
      };

      if (isEditing && currentProduct.id) {
        productData.id = currentProduct.id;
        await productService.updateProduct(productData as UpdateProductData);
      } else {
        await productService.createProduct(productData);
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
      } catch (err: any) {
        alert(err.message || "Failed to delete product");
      }
    }
  };

  // Filtering products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rendering loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading products...</p>
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
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <h1 className="text-xl font-bold text-gray-800">Product Management</h1>
        <button
          onClick={handleAddProduct}
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
            <h1 className="text-3xl font-bold text-gray-800">
              Product Management
            </h1>
            <button
              onClick={handleAddProduct}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 px-4 py-2 border rounded-lg w-full focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm md:text-base">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-3 text-sm md:text-base">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm md:text-base">
                      {product.product_category_id || "No Category"}
                    </td>
                    <td className="px-4 py-3 text-sm md:text-base">
                      {product.price} {product.unit_type}
                    </td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-500 hover:underline text-sm md:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl mx-auto my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[80vh] overflow-y-auto p-6">
              <h2 className="text-lg md:text-xl font-bold mb-6 sticky top-0 bg-white z-10 pb-2 border-b">
                {isEditing ? "Edit Product" : "Add Product"}
              </h2>

              <form className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={currentProduct.name || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter product name"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Latin Name
                    </label>
                    <input
                      type="text"
                      value={currentProduct.latin_name || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          latin_name: e.target.value,
                        })
                      }
                      placeholder="Enter latin name"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCurrentProduct({
                              ...currentProduct,
                              image: file,
                            });
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setImagePreview(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Choose Image
                      </label>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Product Preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Price
                    </label>
                    <input
                      type="number"
                      value={currentProduct.price || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Enter price"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={currentProduct.description || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter description"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none h-20"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Morphology
                    </label>
                    <textarea
                      value={currentProduct.morphology || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          morphology: e.target.value,
                        })
                      }
                      placeholder="Enter morphology"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Efficacy
                    </label>
                    <textarea
                      value={currentProduct.efficacy || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          efficacy: e.target.value,
                        })
                      }
                      placeholder="Enter efficacy"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Utilization
                    </label>
                    <textarea
                      value={currentProduct.utilization || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          utilization: e.target.value,
                        })
                      }
                      placeholder="Enter utilization"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Composition
                    </label>
                    <textarea
                      value={currentProduct.composition || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          composition: e.target.value,
                        })
                      }
                      placeholder="Enter composition"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Research Results
                    </label>
                    <textarea
                      value={currentProduct.research_results || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          research_results: e.target.value,
                        })
                      }
                      placeholder="Enter research results"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none h-20"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProduct}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    {isEditing ? "Update Product" : "Save Product"}
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

export default DashboardProductPage;
