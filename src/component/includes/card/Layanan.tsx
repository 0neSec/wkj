import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: "Pelayanan Rawat Jalan Berbasis Jamu",
    description: "Layanan pengobatan dengan pendekatan jamu tradisional",
    icon: "🏥",
    href: "rawat-jalan"
  },
  {
    id: 2,
    title: "Griya Jamu",
    description: "Pusat pembelajaran dan pengembangan jamu",
    icon: "🌿",
    href: "griya-jamu"
  },
  {
    id: 3,
    title: "Laboratorium Klinik",
    description: "Fasilitas pengujian dan penelitian klinis",
    icon: "🔬",
    href: "laboratorium-klinik"
  },
  {
    id: 4,
    title: "Akupuntur & Akupresure",
    description: "Terapi pengobatan tradisional",
    icon: "💆",
    href: "akupuntur-akupresure"
  },
  {
    id: 5,
    title: "Konsultasi Gizi",
    description: "Layanan konsultasi nutrisi dan diet",
    icon: "🥗",
    href: "konsultasi-gizi"
  },
  {
    id: 6,
    title: "Pengolahan Pasca Panen Tanaman Obat",
    description: "Fasilitas pengolahan tanaman obat",
    icon: "🌱",
    href: "pengolahan-tanaman"
  },
  {
    id: 7,
    title: "Penelitian Saintifikasi Jamu",
    description: "Riset dan pengembangan jamu",
    icon: "📚",
    href: "penelitian-jamu"
  },
  {
    id: 8,
    title: "Wisata Edukasi Tanaman Obat",
    description: "Program wisata edukasi berbasis tanaman obat",
    icon: "🌺",
    href: "wisata-edukasi"
  },
  {
    id: 9,
    title: "Pelatihan & Workshop Pemanfaatan Tanaman Obat",
    description: "Program pelatihan pengolahan tanaman obat",
    icon: "👨‍🏫",
    href: "pelatihan-workshop"
  },
  {
    id: 10,
    title: "Produk dan Layanan Bahan Baku Tanaman Obat",
    description: "Penyediaan bahan baku tanaman obat berkualitas",
    icon: "🌾",
    href: "produk-layanan"
  }
];

const ServiceGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Link 
          key={service.id} 
          to={`/services/${service.href}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">{service.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600">
                {service.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ServiceGrid;