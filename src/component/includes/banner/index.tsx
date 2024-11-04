import React from 'react';

const HeroBanner = () => {
  return (
    <div className="bg-white p-8 md:p-16 pt-24 md:pt-16"> {/* Added pt-24 for mobile, md:pt-16 for larger screens */}
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-600 mb-4">
            Wisata Kesehatan Jamu
          </h1>
          <p className="text-gray-600 mb-6">
          Wisata Kesehatan Jamu (WKJ) adalah satu jenis fasilitas pelayanan kesehatan masyarakat yang ada di Kabupaten Tegal dan merupakan program unggulan dari Pemerintah Kabupaten Tegal serta satu-satunya fasilitas pelayanan kesehatan tradisional milik Pemerintah yang memadukan dunia ilmu kedokteran konvensional dengan pengobatan tradisional.
          </p>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-xl">
            Eksplor kesehatan jamu
          </button>
        </div>
        <div className="md:w-1/2 relative">
          <img src="/assets/images/jenis-jenis-jamu.png" alt="Map of Indonesia" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;