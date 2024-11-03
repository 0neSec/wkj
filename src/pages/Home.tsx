import React from "react";
import Navbar from "../component/includes/navbar";
import Footer from "../component/includes/footer";
import Blog from "../component/includes/artikel";
import Faq from "../component/particle/faq";
import HeroBanner from "../component/includes/banner";
import { ProductGrid } from "../component/includes/product";
import ServiceGrid from "../component/includes/card/Layanan";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeroBanner />
          <div className="py-8 mt-5">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Layanan & Produk
              </h1>
              <p className="mt-2 text-gray-600 text-center">
                Temukan layanan dan produk herbal terbaik untuk kesehatan Anda
              </p>
              <div className="p-10">
                <ProductGrid
                  showSearch={false}
                  showCategories={false}
                  maxItems={8} // Optional: limit number of items shown
                  showSort={false}
                />
              </div>
            </div>
          </div>
          <div className="py-8 mt-5">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Layanan Wisata Kesehatan Jamu
              </h1>
              
              <div className="mt-8">
                <ServiceGrid />
              </div>
            </div>
          </div>
          <Blog isHomePage={true} />
          <Faq />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
