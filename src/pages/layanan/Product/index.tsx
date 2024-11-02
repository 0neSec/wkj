import React from "react";
import Navbar from "../../../component/includes/navbar";
import HeroBanner from "../../../component/includes/banner";
import Footer from "../../../component/includes/footer";
import { ProductGrid } from "../../../component/includes/product";

function ProductLayanan() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                  showSearch={true}
                  showCategories={true}
                  showPagination={true}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductLayanan;
