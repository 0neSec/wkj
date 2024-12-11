import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Store Data Type
interface Store {
  id: number;
  name: string;
  description: string;
  location: string;
  specialty: string;
  image: string;
}

// Sample Store Data
const storeData: Store[] = [
  {
    id: 1,
    name: 'Herbal Harmony',
    description: 'Traditional herbal wellness center',
    location: 'Jakarta Selatan',
    specialty: 'Traditional Jamu',
    image: 'assets/herbal-store-1.webp'
  },
  {
    id: 2,
    name: 'Green Essence Apotik',
    description: 'Natural remedies and herbal supplements',
    location: 'Bandung',
    specialty: 'Herbal Supplements',
    image: 'assets/herbal-store-2.webp'
  },
  {
    id: 3,
    name: 'Jamu Nusantara',
    description: 'Authentic Indonesian herbal medicine',
    location: 'Yogyakarta',
    specialty: 'Traditional Mixtures',
    image: 'assets/herbal-store-3.webp'
  },
  {
    id: 4,
    name: 'Natural Healing Hub',
    description: 'Holistic wellness and herbal treatments',
    location: 'Surabaya',
    specialty: 'Herbal Therapies',
    image: 'assets/herbal-store-4.webp'
  },
  {
    id: 5,
    name: 'Herbal Roots',
    description: 'Community herbal wellness center',
    location: 'Bali',
    specialty: 'Organic Herbal Products',
    image: 'assets/herbal-store-5.webp'
  },
  {
    id: 6,
    name: 'Green Wellness',
    description: 'Comprehensive herbal solutions',
    location: 'Semarang',
    specialty: 'Herbal Consultations',
    image: 'assets/herbal-store-6.webp'
  }
];

// Store Card Component
const StoreCard: React.FC<{ store: Store }> = ({ store }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <img 
        src={store.image} 
        alt={store.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{store.name}</h3>
        <p className="text-gray-600 mb-2">{store.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-semibold mr-2">Location:</span>
            {store.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-semibold mr-2">Specialty:</span>
            {store.specialty}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Store Listing Component
interface StoreListProps {
  isHomePage?: boolean;
}

const StoreList: React.FC<StoreListProps> = ({ isHomePage = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Determine stores to display
  const displayStores = isHomePage 
    ? storeData.slice(0, 6)  // Show only first 6 stores on home page
    : storeData;

  // Filter stores based on search term
  const filteredStores = isHomePage 
    ? displayStores 
    : displayStores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Input (only for non-home pages) */}
      {!isHomePage && (
        <div className="mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search stores by name, location, or specialty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-full pl-10"
            />
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      )}

      {/* Store Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {filteredStores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {/* No Results State (only for non-home pages) */}
      {!isHomePage && filteredStores.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          No stores found matching your search.
        </div>
      )}
    </div>
  );
};

export default StoreList;