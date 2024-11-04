import React from 'react';
import Navbar from '../component/includes/navbar';
import Footer from '../component/includes/footer';
import TentangProfile from '../component/includes/about/Tentang';

function Tentang() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 md:px-8">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br opacity-70" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Hero Header */}
            <div className="max-w-6xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                Wisata Kesehatan Jamu Tegal
              </h1>
              
              {/* Hero Image */}
              <div className="flex justify-center mb-8">
                <img
                  src="/assets/logo.png"
                  alt="Wisata Kesehatan Jamu Tegal"
                  className="max-w-full h-auto" // Ensures the image is responsive
                />
              </div>

              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-1 w-20 bg-green-600 rounded-full" />
                <div className="h-2 w-2 bg-green-600 rounded-full" />
                <div className="h-1 w-20 bg-green-600 rounded-full" />
              </div>
            </div>
            
            {/* Profile Content */}
            <TentangProfile />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Tentang;
