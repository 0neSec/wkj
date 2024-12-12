import React, { useState } from 'react';
import { Search, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';

// Tipe Data Produsen Jamu
interface ProdusenJamu {
  id: number;
  nama: string;
  deskripsi: string;
  lokasi: string;
  spesialitas: string;
  gambar: string;
  tahunBerdiri: number;
  sertifikasi: string[];
}

// Data Contoh Produsen Jamu
const dataProdusenJamu: ProdusenJamu[] = [
  {
    id: 1,
    nama: 'Sido Muncul',
    deskripsi: 'Produsen obat herbal tradisional legendaris',
    lokasi: 'Semarang, Jawa Tengah',
    spesialitas: 'Formulasi Jamu Tradisional',
    gambar: 'assets/jamu-producer-1.webp',
    tahunBerdiri: 1940,
    sertifikasi: ['Bersertifikat BPOM', 'Bersertifikat Halal']
  },
  {
    id: 2,
    nama: 'Air Mancur',
    deskripsi: 'Merek kesehatan herbal terkenal dengan keahlian lintas generasi',
    lokasi: 'Solo, Jawa Tengah',
    spesialitas: 'Tonik dan Suplemen Herbal',
    gambar: 'assets/jamu-producer-2.webp',
    tahunBerdiri: 1963,
    sertifikasi: ['Bersertifikat BPOM', 'Bahan Organik']
  },
  {
    id: 3,
    nama: 'Deltomed',
    deskripsi: 'Perusahaan obat herbal tradisional inovatif',
    lokasi: 'Yogyakarta',
    spesialitas: 'Formulasi Jamu Modern',
    gambar: 'assets/jamu-producer-3.webp',
    tahunBerdiri: 1985,
    sertifikasi: ['Bersertifikat BPOM', 'Praktik Berkelanjutan']
  },
  {
    id: 4,
    nama: 'Cap Nyonya Meneer',
    deskripsi: 'Produsen jamu milik keluarga bersejarah',
    lokasi: 'Semarang, Jawa Tengah',
    spesialitas: 'Ramuan Herbal Klasik',
    gambar: 'assets/jamu-producer-4.webp',
    tahunBerdiri: 1919,
    sertifikasi: ['Merek Warisan', 'Resep Tradisional']
  },
  {
    id: 5,
    nama: 'Mustika Ratu',
    deskripsi: 'Merek kecantikan dan kesehatan herbal modern',
    lokasi: 'Jakarta',
    spesialitas: 'Produk Kecantikan dan Kesehatan Herbal',
    gambar: 'assets/jamu-producer-5.webp',
    tahunBerdiri: 1978,
    sertifikasi: ['Pemenang Penghargaan Kecantikan', 'Bersertifikat BPOM']
  },
  {
    id: 6,
    nama: 'NASA Herbal',
    deskripsi: 'Produsen produk herbal alami dan organik',
    lokasi: 'Surakarta',
    spesialitas: 'Solusi Herbal Organik',
    gambar: 'assets/jamu-producer-6.webp',
    tahunBerdiri: 2005,
    sertifikasi: ['Sertifikasi Organik', 'Produksi Berkelanjutan']
  }
];

// Komponen Kartu Produsen Jamu
const KartuProdusen: React.FC<{ produsen: ProdusenJamu }> = ({ produsen }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <img 
        src={produsen.gambar} 
        alt={produsen.nama} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{produsen.nama}</h3>
        <p className="text-gray-600 mb-2">{produsen.deskripsi}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={16} className="mr-2 text-green-600" />
            <span className="font-semibold mr-2">Lokasi:</span>
            {produsen.lokasi}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Award size={16} className="mr-2 text-yellow-600" />
            <span className="font-semibold mr-2">Tahun Berdiri:</span>
            {produsen.tahunBerdiri}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-semibold mr-2">Spesialitas:</span>
            {produsen.spesialitas}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {produsen.sertifikasi.map((sertifikat, index) => (
              <span 
                key={index} 
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {sertifikat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Komponen Daftar Produsen Jamu
const DaftarProdusenJamu: React.FC = () => {
  const [kataPencarian, setKataPencarian] = useState('');

  // Filter produsen berdasarkan kata pencarian
  const produsenTerfilter = dataProdusenJamu.filter(produsen => 
    produsen.nama.toLowerCase().includes(kataPencarian.toLowerCase()) ||
    produsen.lokasi.toLowerCase().includes(kataPencarian.toLowerCase()) ||
    produsen.spesialitas.toLowerCase().includes(kataPencarian.toLowerCase())
  );

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Kotak Pencarian */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari produsen berdasarkan nama, lokasi, atau spesialitas..." 
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