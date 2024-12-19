import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { heroContentService, HeroContent } from "../../services/hero";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of Link

const HomeBanner = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const content = await heroContentService.getHeroContent();
        if (content.length > 0) {
          setHeroContent(content[0]); // Assume the first item is the banner content
        }
      } catch (err) {
        setError("Failed to fetch hero content.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  // Handler to navigate to product page
  const handleExploreProduct = () => {
    navigate('/product');
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;
  }

  if (!heroContent) {
    return <div className="min-h-screen flex justify-center items-center">No content available.</div>;
  }
  
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
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-6 leading-tight tracking-tight">
            {heroContent.title}
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            {heroContent.description}
          </p>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <motion.button
               onClick={handleExploreProduct} // Use onClick to navigate
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out shadow-lg group"
            >
              Explore Jamu
              <ChevronRight
                className="ml-2 group-hover:translate-x-1 transition duration-300"
                size={20}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="relative group">
            <motion.img
              src={`${process.env.REACT_APP_API_URL}${heroContent.image}`}
              alt={heroContent.title}
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
    </div>
  );
};

export default HomeBanner;