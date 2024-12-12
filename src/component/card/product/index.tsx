import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Product Data Type
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Sample Product Data
const productData: Product[] = [
  {
    id: 1,
    name: 'Jamu Kunyit Asam',
    description: 'Traditional herbal drink for digestion',
    price: 15000,
    category: 'Herbal Drinks',
    image: 'assets/jamu-kunyit-asam.webp'
  },
  {
    id: 2,
    name: 'Jamu Beras Kencur',
    description: 'Herbal mixture for stamina and health',
    price: 18000,
    category: 'Herbal Drinks',
    image: 'assets/jamu-beras-kencur.webp'
  },
  {
    id: 3,
    name: 'Temulawak Extract',
    description: 'Natural supplement for liver health',
    price: 25000,
    category: 'Herbal Supplements',
    image: 'assets/temulawak.webp'
  },
  {
    id: 4,
    name: 'Ginger Herbal Tea',
    description: 'Warming herbal tea for immunity',
    price: 12000,
    category: 'Herbal Teas',
    image: 'assets/ginger-tea.webp'
  },
  {
    id: 5,
    name: 'Jamu Galian Singset',
    description: 'Herbal mixture for body fitness',
    price: 20000,
    category: 'Herbal Drinks',
    image: 'assets/galian-singset.webp'
  },
  {
    id: 6,
    name: 'Herbal Sinom',
    description: 'Traditional Indonesian herbal drink',
    price: 16000,
    category: 'Herbal Drinks',
    image: 'assets/sinom.webp'
  },
  {
    id: 7,
    name: 'Herbal Sinom',
    description: 'Traditional Indonesian herbal drink',
    price: 16000,
    category: 'Herbal Drinks',
    image: 'assets/sinom.webp'
  },
  // Add more products here
];

// Categories
const categories = [
  'All',
  'Herbal Drinks',
  'Herbal Supplements',
  'Herbal Teas',
  'Traditional Mixtures'
];

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold text-lg">
            Rp {product.price.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Product Listing Component
interface ProductListProps {
  isHomePage?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ isHomePage = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter products based on search and category
  const filteredProducts = productData.filter(product => 
    (isHomePage ? true : 
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (selectedCategory === 'All' || product.category === selectedCategory))
  )).slice(0, isHomePage ? 6 : undefined);

  return (
    <div className="container mx-auto px-4 py-12">
      {!isHomePage && (
        <div className="flex mb-8">
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="md:hidden mr-4 text-gray-700"
          >
            <Filter size={24} />
          </button>

          {/* Search Input */}
          <div className="flex-grow relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-full pl-10"
            />
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        {!isHomePage && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 pr-8">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-4 py-2 rounded-lg mb-2 ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-blue-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween' }}
                  className="absolute left-0 top-0 w-64 h-full bg-white shadow-2xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Categories</h3>
                    <button onClick={() => setIsSidebarOpen(false)}>
                      <X size={24} />
                    </button>
                  </div>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsSidebarOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-lg mb-2 ${
                        selectedCategory === category 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Product Grid */}
        <div className={`${!isHomePage ? 'md:w-[calc(100%-16rem)]' : 'w-full'}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;