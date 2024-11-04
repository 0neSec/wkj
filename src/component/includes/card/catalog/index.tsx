import React from 'react';
import { Link } from 'react-router-dom';

const catalog = [
  {
    id: 1,
    title: "Simplisia/Tanaman Kering",
    icon: "🌿",
    href: "rawat-jalan"
  },
  {
    id: 2,
    title: "Tanaman Obat",
    icon: "🌿",
    href: "griya-jamu"
  },
  {
    id: 3,
    title: "Produk Inovasi Tanaman Obat",
    icon: "🏥",
    href: "laboratorium-klinik"
  },
];

const CatalogGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {catalog.map((catalog) => (
        <Link 
          key={catalog.id} 
          to={`/layanan/${catalog.href}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">{catalog.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {catalog.title}
              </h3>
              {/* <p className="text-sm text-gray-600">
                {catalog.description}
              </p> */}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CatalogGrid;