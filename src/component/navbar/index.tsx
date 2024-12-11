import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define a type for menu items that can optionally have submenus
interface MenuItem {
  label: string;
  href: string;
  subMenu?: string[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems: MenuItem[] = [
    { label: 'Beranda', href: '#' },
    { label: 'Identifikasi Tanaman', href: '#' },
    { label: 'Farmakope Herbal', href: '#' },
    { label: 'Jamu Indonesia', href: '#' },
    { label: 'Produsen Jamu', href: '#' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <img 
            src="assets/wkj.webp" 
            alt="Logo" 
            className="h-14 w-auto rounded-full"
          />
          <span className="font-bold text-2xl text-blue-800">WKJ</span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item, index) => (
            <div key={index} className="group relative">
              <a 
                href={item.href} 
                className="text-gray-800 hover:text-blue-600 font-semibold flex items-center transition duration-300"
              >
                {item.label}
                {item.subMenu && <ChevronDown size={16} className="ml-1" />}
              </a>
              {item.subMenu && (
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-3 mt-2 min-w-[220px] z-50">
                  {item.subMenu.map((subItem, subIndex) => (
                    <a 
                      key={subIndex} 
                      href="#" 
                      className="block px-4 py-2 hover:bg-blue-50 rounded-md text-gray-700 hover:text-blue-600"
                    >
                      {subItem}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-300"
          >
            Login
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
          >
            Register
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu} 
            className="text-gray-800 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="absolute right-0 top-0 w-64 h-full bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-5">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <a 
                        href={item.href} 
                        className="text-gray-800 hover:text-blue-600 font-semibold"
                      >
                        {item.label}
                      </a>
                      {item.subMenu && <ChevronDown size={16} className="text-gray-600" />}
                    </div>
                    {item.subMenu && (
                      <div className="mt-2 space-y-2">
                        {item.subMenu.map((subItem, subIndex) => (
                          <a 
                            key={subIndex} 
                            href="#" 
                            className="block text-sm text-gray-600 hover:text-blue-600 pl-3"
                          >
                            {subItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-5 border-t space-y-4">
                  <button className="w-full px-5 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50">
                    Login
                  </button>
                  <button className="w-full px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
