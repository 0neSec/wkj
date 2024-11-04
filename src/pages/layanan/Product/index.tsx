import React from "react";
import Navbar from "../../../component/includes/navbar";
import Footer from "../../../component/includes/footer";
import ProductPage from "../../../component/includes/product";


function ProductLayanan() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-12">
            <div className="text-center space-y-2 mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Layanan & Produk
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
                Temukan layanan dan produk herbal terbaik untuk kesehatan Anda
              </p>
            </div>

            <div className="mt-4 sm:mt-6 lg:mt-8">
            <ProductPage showSearchAndFilter={true} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProductLayanan;
