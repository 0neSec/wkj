import React from "react";
import Navbar from "../component/includes/navbar";
import Footer from "../component/includes/footer";
import Blog from "../component/includes/artikel";
import HeroBanner from "../component/includes/banner";
import ServiceGrid from "../component/includes/card/Layanan";
import ProductPage from "../component/includes/product";
import Detection from "../component/includes/detaction";
import CatalogGrid from "../component/includes/card/catalog";
import NewsGrid from "../component/includes/card/berita";

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
                Layanan Produk
              </h1>
              <p className="mt-2 text-gray-600 text-center">
                Temukan produk herbal terbaik untuk kesehatan Anda
              </p>
              <div className="p-10">
              <ProductPage showSearchAndFilter={false}   limit={6}/>
              </div>
            </div>
          </div>
          <div className="py-8 mt-5">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Identifikasi Tanaman
              </h1>
              
              <div className="mt-8">
                <Detection />
              </div>
            </div>
          </div>
          <div className="py-8 mt-5">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Layanan Wisata Kesehatan Jamu
              </h1>
              <p className="text-center">Temukan pelayanan untuk kesehatan</p>
              <div className="mt-8">
                <ServiceGrid />
              </div>
            </div>
          </div>

          <div className="py-8 mt-5">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Berita Terkait
              </h1>
              
              <div className="mt-8">
                <NewsGrid isHomePage={true} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
