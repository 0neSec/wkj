import React from "react";
import { motion } from "framer-motion";
import { Leaf, Store } from "lucide-react";
import Navbar from "../component/navbar";
import HomeBanner from "../component/hero";
import ProductList from "../component/card/product";
import StoreList from "../component/card/store";
import HerbalDetection from "../component/card/detection";
import Footer from "../component/footer";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function Home() {
  return (
    <div className="bg-white">
    <SpeedInsights/>
      <Navbar />
      <HomeBanner />

      {/* Herbal Detection Section with Title */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 md:px-8 lg:px-16 py-16 text-center"
      >
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

        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-green-800 tracking-wide"
        >
          Herbal Detection
        </motion.h2>

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

      {/* Farmakope Herbal Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 md:px-8 lg:px-16 py-16 text-center"
      >
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

        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-green-800 tracking-wide"
        >
          Farmakope Herbal
        </motion.h2>

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
          <ProductList isHomePage={true} />
        </motion.div>
      </motion.div>

      {/* Herbal Stores Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 md:px-8 lg:px-16 py-16 text-center"
      >
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
            <Store className="text-green-800 w-6 h-6" />
          </motion.div>

          <motion.span
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-grow h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-800 rounded-full mx-4"
          ></motion.span>
        </div>

        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-green-800 tracking-wide"
        >
          Herbal Stores
        </motion.h2>

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
          <StoreList isHomePage={true} />
        </motion.div>
      </motion.div>

      <Footer/>
    </div>
  );
}