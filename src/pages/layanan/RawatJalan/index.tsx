import React from 'react'
import Navbar from '../../../component/includes/navbar'
import HeroBanner from '../../../component/includes/banner'
import Footer from '../../../component/includes/footer'
import ShowServiceCategory from './ShowServiceCategory'


function RawatJalan() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ShowServiceCategory categoryId={29}/>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RawatJalan