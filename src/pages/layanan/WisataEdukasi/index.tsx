import React from 'react'
import Navbar from '../../../component/includes/navbar'
import HeroBanner from '../../../component/includes/banner'
import Footer from '../../../component/includes/footer'
// import ProductsPageMarketplace from '../../../component/includes/product'


function WisataEdukasi() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeroBanner/>
          {/* <ProductsPageMarketplace/> */}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default WisataEdukasi