import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import Navbar from "../component/navbar";
import HerbalDetection from "../component/card/detection";
import Footer from "../component/footer";

export default function HerbalDetectionPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-16 text-center mt-10"
      >
        {/* Section Header with Animated Elements */}
        <div className="flex items-center justify-center mb-8 relative">
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-grow h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-800 rounded-full mx-4"
          ></motion.span>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-green-100 p-3 rounded-full shadow-md"
          >
            <Leaf className="text-green-800 w-6 h-6" />
          </motion.div>

          <motion.span
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-grow h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-800 rounded-full mx-4"
          ></motion.span>
        </div>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-green-800 tracking-wide mb-6"
        >
          Herbal Detection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-600 max-w-2xl mx-auto mb-12"
        >
          Discover and identify herbal plants with our advanced detection technology. 
          Upload an image and get instant information about the herbal species.
        </motion.p>

        {/* Herbal Detection Component */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mt-8"
        >
          <HerbalDetection />
        </motion.div>
      </motion.div>
      <Footer/>
    </div>
  );
}