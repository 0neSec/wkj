import React, { useState, useEffect } from 'react';
import { Search, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { jamuManufactureService, JamuManufacture } from '../../../services/produsen'; // Adjust import path

// Komponen Kartu Produsen Jamu
const KartuProdusen: React.FC<{ produsen: JamuManufacture }> = ({ produsen }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      {produsen.image && (
        <img 
          src={`${process.env.REACT_APP_API_URL}${produsen.image}`} 
          alt={produsen.name} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{produsen.name}</h3>
        <p className="text-gray-600 mb-2">{produsen.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={16} className="mr-2 text-green-600" />
            <span className="font-semibold mr-2">Lokasi:</span>
            {produsen.address}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Award size={16} className="mr-2 text-yellow-600" />
            <span className="font-semibold mr-2">Didirikan:</span>
            {new Date(produsen.created_at).getFullYear()}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {/* Optional: Add dynamic badges or certification tags */}
            <a 
              href={produsen.link_website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
            >
              Website
            </a>
            <a 
              href={produsen.link_facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Komponen Daftar Produsen Jamu
const DaftarProdusenJamu: React.FC = () => {
  const [produsenJamu, setProdusenJamu] = useState<JamuManufacture[]>([]);
  const [muatanData, setMuatanData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kataPencarian, setKataPencarian] = useState('');

  // Ambil data saat komponen dimuat
  useEffect(() => {
    const muatProdusen = async () => {
      try {
        const data = await jamuManufactureService.getJamuManufactures();
        setProdusenJamu(data);
        setMuatanData(false);
      } catch (kesalahan) {
        console.error('Gagal memuat produsen jamu:', kesalahan);
        setError('Gagal memuat data produsen jamu');
        setMuatanData(false);
      }
    };

    muatProdusen();
  }, []);

  // Filter produsen berdasarkan kata pencarian
  const produsenTerfilter = produsenJamu.filter(produsen => 
    produsen.name.toLowerCase().includes(kataPencarian.toLowerCase()) ||
    produsen.address.toLowerCase().includes(kataPencarian.toLowerCase()) ||
    produsen.description.toLowerCase().includes(kataPencarian.toLowerCase())
  );

  // Tampilan loading
  if (muatanData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-green-500"></div>
      </div>
    );
  }

  // Tampilan error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Kotak Pencarian */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari produsen berdasarkan nama, lokasi, atau deskripsi..." 
              value={kataPencarian}
              onChange={(e) => setKataPencarian(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-full pl-10 focus:outline-none focus:border-green-500 transition-all"
            />
            <Search size={20} className="absolute left-3 top-3 text-green-400" />
          </div>
        </div>

        {/* Grid Produsen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produsenTerfilter.map(produsen => (
            <KartuProdusen key={produsen.id} produsen={produsen} />
          ))}
        </div>

        {/* Status Tidak Ada Hasil */}
        {produsenTerfilter.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            Tidak ada produsen jamu yang ditemukan sesuai pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
};

export default DaftarProdusenJamu;