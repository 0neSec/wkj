import React, { useState } from 'react';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeBanner = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center pt-24 pb-16 px-4 md:px-12 overflow-hidden">
      {/* Decorative Blurred Circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"
      />

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-20">
        {/* Left Side - Text and CTA */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Discover Your <span className="text-blue-600">Wellness Journey</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Embark on a transformative path to holistic health with traditional herbal wisdom. Experience the power of nature's healing secrets.
          </p>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out shadow-lg group"
            >
              Get Started
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition duration-300" size={20} />
            </motion.button>
            
            <motion.button 
              onClick={openVideoModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 py-3 px-6 rounded-full transition duration-300 group"
            >
              <PlayCircle className="mr-2" size={20} />
              Watch Video
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side - Image with Advanced Hover Effects */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="relative group">
            <motion.img 
              src="assets/wkj.webp" 
              alt="Wisata Kesehatan Jamu" 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="rounded-3xl shadow-2xl object-cover w-full max-w-md aspect-square"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
              className="absolute inset-0 bg-blue-600 rounded-3xl transition duration-500 ease-in-out"
            />
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={closeVideoModal}>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
              title="Wellness Journey Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
            <button 
              onClick={closeVideoModal} 
              className="absolute -top-8 right-0 text-white hover:text-blue-300 transition"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomeBanner;