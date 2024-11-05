import React from "react";
import Navbar from "../component/includes/navbar";
import Footer from "../component/includes/footer";
import TentangProfile from "../component/includes/Tentang/Tentang";
import TaskManager from "../component/includes/Tentang/Task";
import History from "../component/includes/Tentang/Sejarah";

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
                  className="max-w-full h-auto"
                />
              </div>
            </div>

            <section className="mt-16">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">
                      Tentang Kami
                    </h2>
                    <div className="flex items-center justify-center gap-4 mb-12">
                      <div className="h-1 w-20 bg-green-600 rounded-full" />
                      <div className="h-2 w-2 bg-green-600 rounded-full" />
                      <div className="h-1 w-20 bg-green-600 rounded-full" />
                    </div>
                  </div>
                  <TentangProfile />
                </div>
              </div>
            </section>

            {/* Task Manager Section */}
            <section className="mt-16">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <TaskManager />
                </div>
              </div>
            </section>

            <section className="mt-16">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">
                     Sejarah
                    </h2>
                    <div className="flex items-center justify-center gap-4 mb-12">
                      <div className="h-1 w-20 bg-green-600 rounded-full" />
                      <div className="h-2 w-2 bg-green-600 rounded-full" />
                      <div className="h-1 w-20 bg-green-600 rounded-full" />
                    </div>
                  </div>
                  <History />
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Tentang;
