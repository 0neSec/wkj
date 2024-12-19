import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, MapPin, Link as LinkIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jamuCenterService, JamuCenter } from '../../../services/central';

// Skeleton Loader Component
const StoreSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 mb-2 w-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 w-1/2"></div>
          <div className="h-4 bg-gray-200 w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

// Store Card Component with Enhanced Accessibility
const StoreCard: React.FC<{ store: JamuCenter }> = ({ store }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="article"
      aria-labelledby={`store-name-${store.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl focus-within:shadow-2xl"
      tabIndex={0}
    >
      {store.image && (
        <img 
          src={`${process.env.REACT_APP_API_URL}${store.image}`} 
          alt={store.name} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <h3 
          id={`store-name-${store.id}`} 
          className="font-bold text-xl mb-2 text-gray-800"
        >
          {store.name}
        </h3>
        <p className="text-gray-600 mb-2">{store.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin size={16} className="mr-2 text-gray-500" />
            {store.address}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            {store.link_maps && (
              <a 
                href={store.link_maps} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Open in Google Maps"
              >
                <MapPin size={16} className="mr-1" /> Maps
              </a>
            )}
            {store.link_website && (
              <a 
                href={store.link_website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                aria-label="Visit Website"
              >
                <LinkIcon size={16} className="mr-1" /> Website
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Store Listing Component with Enhanced Features
const StoreList: React.FC<{ isHomePage?: boolean }> = ({ 
  isHomePage = false 
}) => {
  const [stores, setStores] = useState<JamuCenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores with error handling and loading state
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const fetchedStores = await jamuCenterService.getJamuCenters();
        setStores(fetchedStores);
      } catch (err) {
        setError('Unable to load Jamu centers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Memoized and debounced store filtering
  const filteredStores = useMemo(() => {
    if (!searchTerm) {
      return isHomePage ? stores.slice(0, 6) : stores;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return stores.filter(store => 
      store.name.toLowerCase().includes(lowercaseSearch) ||
      store.address.toLowerCase().includes(lowercaseSearch)
    );
  }, [searchTerm, stores, isHomePage]);

  // Error and Loading States
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(isHomePage ? 6 : 9)].map((_, index) => (
            <StoreSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        role="alert" 
        className="container mx-auto px-4 py-12 text-center text-red-600 bg-red-50 rounded-lg"
      >
        <Loader2 size={48} className="mx-auto mb-4 animate-spin" />
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
              aria-label="Search Jamu centers"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search 
              size={20} 
              className="absolute left-3 top-3 text-gray-400" 
              aria-hidden="true" 
            />
          </div>
        </div>
      )}

      {/* Store Grid with Animation */}
      <AnimatePresence>
        {filteredStores.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {filteredStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-12"
          >
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No Jamu centers found matching your search.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreList;