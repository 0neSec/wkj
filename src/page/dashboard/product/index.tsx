import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Search
} from 'lucide-react';
import Sidebar from '../../../component/sidebar';
import { productService, Product, ProductCategory, UpdateProductData, CreateProductData } from '../../../services/product/product.service';
import { productCategoryService } from '../../../services/product/product-category.service';

const DashboardProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          productService.getAllProductsWithCategories(),
          productCategoryService.getAllProductCategories()
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch products and categories');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = () => {
    setCurrentProduct({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...currentProduct,
        id: currentProduct.id,
      };

      if (isEditing && currentProduct.id) {
        const updatedProduct = await productService.updateProduct(productData as UpdateProductData);
        if (updatedProduct) {
          setProducts(products.map(prod => 
            prod.id === updatedProduct.id ? updatedProduct : prod
          ));
        }
      } else {
        const newProduct = await productService.createProduct(productData as CreateProductData);
        if (newProduct) {
          setProducts([...products, newProduct]);
        }
      }
      setIsModalOpen(false);
      setCurrentProduct({});
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(prod => prod.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const name = product.name || '';
    const latinName = product.latin_name || '';

    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           latinName.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 mt-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 mt-10">
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
            <button
              onClick={handleAddProduct}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <PlusCircle className="mr-2" size={20} />
              Tambah Produk
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama atau nama latin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left hidden md:table-cell">ID</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left hidden md:table-cell">Nama Latin</th>
                  <th className="p-3 text-left hidden lg:table-cell">Kategori</th>
                  <th className="p-3 text-left hidden lg:table-cell">Harga</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 hidden md:table-cell">{product.id}</td>
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 hidden md:table-cell">{product.latin_name}</td>
                    <td className="p-3 hidden lg:table-cell">{product.product_category_id || 'Tanpa Kategori'}</td>
                    <td className="p-3 hidden lg:table-cell">{product.price}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"
                          title="Edit Produk"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                          title="Hapus Produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Tidak ada produk ditemukan. Silakan coba pencarian lain.
              </div>
            )}
            
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter product name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Latin Name</label>
                <input
                  type="text"
                  value={currentProduct.latin_name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, latin_name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter latin name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Daerah</label>
                <input
                  type="text"
                  value={currentProduct.area_name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, area_name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter Nama Daerah"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Familia</label>
                <input
                  type="text"
                  value={currentProduct.familia || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, familia: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter Familia"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={currentProduct.price || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter price"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Unit Type</label>
                <input
                  type="text"
                  value={currentProduct.unit_type || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, unit_type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., kg, g, ml"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product Category</label>
                <select
                  value={currentProduct.product_category_id || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, product_category_id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={currentProduct.description || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter product description"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={!currentProduct.name || !currentProduct.product_category_id}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProductPage;
