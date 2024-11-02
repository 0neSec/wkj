import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, User } from 'lucide-react';
import menuData from './menu.json';
import { Service, MenuData } from './types';
import { authService } from '../../../services/auth.service';

const typedMenuData = menuData as MenuData;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const isAuthenticated = authService.isAuthenticated();
  const username = authService.getCurrentUsername();
  const { role } = authService.getAuthState();
  const isAdmin = role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileMenuOpen && !target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const renderServiceItem = (service: Service) => (
    <a
      key={service.id}
      href={`/layanan/${service.href}`}
      className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      <span className="text-2xl mr-4">{service.icon}</span>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800 mb-1">
          {service.title}
        </h4>
        <p className="text-xs text-gray-600">{service.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 self-center" />
    </a>
  );

  const renderMenuItem = (item: string) => {
    if (item === 'Layanan') {
      return (
        <div className="relative">
          <button
            className="flex items-center text-grey font-bold text-sm group"
            onMouseEnter={() => setServicesMenuOpen(true)}
            onMouseLeave={() => setServicesMenuOpen(false)}
          >
            {item}
            <ChevronDown className="ml-1 w-4 h-4" />
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </button>

          <div
            className={`absolute left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-white rounded-lg shadow-xl py-6 px-4 transition-all duration-200 ${servicesMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onMouseEnter={() => setServicesMenuOpen(true)}
            onMouseLeave={() => setServicesMenuOpen(false)}
          >
            <div className="grid grid-cols-2 gap-4">
              {typedMenuData.services.map(renderServiceItem)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <a
        href={item === 'Beranda' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
        className="relative overflow-hidden group"
      >
        {item}
        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
      </a>
    );
  };

  const AuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="relative profile-menu-container">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition-colors duration-300"
            onClick={toggleProfileMenu}
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-semibold">{username}</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 transition-all duration-200 ${profileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          >
            {isAdmin && (
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Dashboard
              </a>
            )}
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Profil Saya
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
            >
              Keluar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <a
          href="/login"
          className="text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-300"
        >
          Masuk
        </a>
        <a
          href="/register"
          className="text-sm font-semibold text-white bg-blue-700 px-4 py-2 rounded-full hover:bg-blue-800 transition-colors duration-300"
        >
          Daftar
        </a>
      </div>
    );
  };

  const MobileAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="mt-6 flex flex-col items-center gap-4 w-full px-4">
          <div className="flex items-center gap-2 text-gray-700 mb-4">
            <User className="w-6 h-6" />
            <span className="text-xl font-semibold">{username}</span>
          </div>
          {isAdmin && (
            <a
              href="/dashboard"
              className="w-full text-center py-2 text-blue-700 font-bold text-xl hover:text-blue-800 transition-colors duration-300"
            >
              Dashboard
            </a>
          )}
          <a
            href="/profile"
            className="w-full text-center py-2 text-blue-700 font-bold text-xl hover:text-blue-800 transition-colors duration-300"
          >
            Profil Saya
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-center py-2 text-red-600 font-bold text-xl hover:text-red-700 transition-colors duration-300"
          >
            Keluar
          </button>
        </div>
      );
    }

    return (
      <div className="mt-6 flex flex-col items-center gap-4 w-full px-4">
        <a
          href="/login"
          className="w-full text-center py-2 text-blue-700 font-bold text-xl hover:text-blue-800 transition-colors duration-300"
        >
          Masuk
        </a>
        <a
          href="/register"
          className="w-full text-center bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800 transition duration-300 ease-in-out font-bold text-xl"
        >
          Daftar
        </a>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col">
      <nav
        className={`fixed top-0 left-0 w-full py-2 px-4 md:px-8 lg:px-12 z-40 transition-all duration-300 ease-in-out shadow-sm ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="flex-shrink-0">
            <img
              src="/assets/logo.png"
              className="rounded-2xl"
              alt="Logo"
              width={40}
              height={40}
            />
          </a>

          <div className="hidden lg:flex flex-grow justify-center items-center">
            <ul className="flex justify-center gap-16 items-center text-center">
              {typedMenuData.menuItems.map((item) => (
                <li key={item} className="relative group">
                  {renderMenuItem(item)}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <AuthButtons />
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close Mobile Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            {typedMenuData.menuItems.map((item) => (
              <div key={item} className="relative w-full">
                {renderMenuItem(item)}
              </div>
            ))}
            <div className="w-full">
              <MobileAuthButtons />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
