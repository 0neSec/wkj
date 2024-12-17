import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { jamuCenterService, JamuCenter } from '../../../services/central'; // Adjust import path as needed

// Store Card Component
const StoreCard: React.FC<{ store: JamuCenter }> = ({ store }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      {store.image && (
        <img 
          src={`${process.env.REACT_APP_API_URL}${store.image}`} 
          alt={store.name} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{store.name}</h3>
        <p className="text-gray-600 mb-2">{store.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-semibold mr-2">Address:</span>
            {store.address}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            {store.link_maps && (
              <a 
                href={store.link_maps} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                Google Maps
              </a>
            )}
            {store.link_website && (
              <a 
                href={store.link_website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                Website
              </a>
            )}
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
  const [stores, setStores] = useState<JamuCenter[]>([]);
  const [filteredStores, setFilteredStores] = useState<JamuCenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const fetchedStores = await jamuCenterService.getJamuCenters();
        setStores(fetchedStores);
        
        // Determine stores to display
        const displayStores = isHomePage 
          ? fetchedStores.slice(0, 6)  // Show only first 6 stores on home page
          : fetchedStores;
        
        setFilteredStores(displayStores);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch Jamu centers');
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [isHomePage]);

  // Search effect
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStores(isHomePage ? stores.slice(0, 6) : stores);
      return;
    }

    const filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredStores(filtered);
  }, [searchTerm, stores, isHomePage]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Loading Jamu Centers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Input (only for non-home pages) */}
      {!isHomePage && (
        <div className="mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Jamu centers by name or address..." 
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
          No Jamu centers found matching your search.
        </div>
      )}
    </div>
  );
};

export default StoreList;