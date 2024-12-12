import React from 'react';
import { Leaf, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
              Discover, explore, and understand herbal medicines with our comprehensive platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-center">
              <li><a href="/" className="hover:text-green-300 transition-colors">Home</a></li>
              <li><a href="/herbal-detection" className="hover:text-green-300 transition-colors">Herbal Detection</a></li>
              <li><a href="/products" className="hover:text-green-300 transition-colors">Farmakope Herbal</a></li>
              <li><a href="/stores" className="hover:text-green-300 transition-colors">Herbal Stores</a></li>
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