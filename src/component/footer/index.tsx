import React, { useState, useEffect } from 'react';
import { Leaf, Facebook, Instagram, Twitter } from 'lucide-react';
import { footerContent1Service } from '../../services/footer/alamat'; // Adjust path as needed

const Footer = () => {
  const [description, setDescription] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const footerContents = await footerContent1Service.getFooterContent1();
        if (footerContents.length > 0) {
          setDescription(footerContents[0].description);
        }
      } catch (error) {
        console.error('Failed to fetch footer content', error);
        setDescription('Farmakope: Empowering Herbal Wellness'); // Fallback description
      }
    };

    fetchFooterContent();
  }, []);

  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <Leaf className="w-8 h-8 mr-2 text-green-300" />
              <h3 className="text-2xl font-bold tracking-wide">Farmakope</h3>
            </div>
            <p className="text-green-200 text-center md:text-left">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-center">
              <li><a href="/" className="hover:text-green-300 transition-colors">Home</a></li>
              <li><a href="/detection_tanaman" className="hover:text-green-300 transition-colors">Identifikasi Tanaman</a></li>
              <li><a href="/products" className="hover:text-green-300 transition-colors">Farmakope Herbal</a></li>
              <li><a href="/jamu-central" className="hover:text-green-300 transition-colors">Central Jamu</a></li>
              <li><a href="/produsen" className="hover:text-green-300 transition-colors">Produsen Jamu</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center">
            <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-green-300 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-green-300 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-green-300 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-8 pt-6 text-center">
          <p className="text-green-200">
            © {currentYear} Farmakope. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;