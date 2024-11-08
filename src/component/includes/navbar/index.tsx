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
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = authService.isAuthenticated();
  const { role } = authService.getAuthState();
  const isAdmin = role === 'admin';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
      if (!target.closest('.services-menu-container')) {
        setServicesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  useEffect(() => {
    const storageType = localStorage.getItem('storageType');
    const storage = storageType === 'local' ? localStorage : sessionStorage;

    const storedUsername = storage.getItem('username');
    const storedEmail = storage.getItem('email');

    setUsername(storedUsername);
    setEmail(storedEmail);
    setLoading(false);
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const renderServiceItem = (service: Service) => (
    <a
      key={service.id}
      href={`/layanan/${service.href}`}
      className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
    >
      <span className="text-2xl mr-4 text-blue-600 group-hover:text-blue-700">{service.icon}</span>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-blue-700">
          {service.title}
        </h4>
        <p className="text-xs text-gray-600">{service.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 self-center group-hover:text-blue-700 transform group-hover:translate-x-1 transition-transform duration-300" />
    </a>
  );

  const renderMobileServiceItem = (service: Service) => (
    <a
      key={service.id}
      href={`/layanan/${service.href}`}
      className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-300"
    >
      <span className="text-xl mr-3 text-blue-600">{service.icon}</span>
      <div className="flex-1">
        <h4 className="text-base font-semibold text-gray-800">{service.title}</h4>
        <p className="text-sm text-gray-600">{service.description}</p>
      </div>
    </a>
  );

  const renderDesktopMenuItem = (item: string) => {
    if (item === 'Layanan') {
      return (
        <div className="services-menu-container">
          <button
            className="flex items-center gap-1 text-gray-700 font-medium text-sm group relative"
            onMouseEnter={() => setServicesMenuOpen(true)}
            onMouseLeave={() => setServicesMenuOpen(false)}
          >
            {item}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </button>

          <div
            className={`absolute left-1/2 -translate-x-1/2 mt-4 w-[800px] bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 ${
              servicesMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
            }`}
            onMouseEnter={() => setServicesMenuOpen(true)}
            onMouseLeave={() => setServicesMenuOpen(false)}
          >
            <div className="grid grid-cols-2 gap-2 p-4">
              {typedMenuData.services.map(renderServiceItem)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <a
        href={item === 'Beranda' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
        className="text-gray-700 font-medium text-sm relative group"
      >
        {item}
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </a>
    );
  };

  const AuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="relative profile-menu-container">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-50"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{username}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <div
            className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 ${
              profileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
            }`}
          >
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{username}</p>
            </div>
            <div className="py-2">
              {isAdmin && (
                <a href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">
                  Dashboard
                </a>
              )}
              <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">
                Profil Saya
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <a
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
        >
          Masuk
        </a>
        <a
          href="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow"
        >
          Daftar
        </a>
      </div>
    );
  };

  const renderMobileMenu = () => (
    <div 
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ${
        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      <div
        className={`fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <img src="/assets/logo.png" alt="Logo" className="h-8 w-8 rounded-xl" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-4">
            {typedMenuData.menuItems.map(item => (
              <div key={item} className="mb-2">
                {item === 'Layanan' ? (
                  <div>
                    <button
                      onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === 'services' ? null : 'services')}
                      className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <span className="text-base font-medium">Layanan</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeMobileSubmenu === 'services' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`mt-2 space-y-1 transition-all duration-300 ${activeMobileSubmenu === 'services' ? 'block' : 'hidden'}`}>
                      {typedMenuData.services.map(renderMobileServiceItem)}
                    </div>
                  </div>
                ) : (
                  <a
                    href={item === 'Beranda' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="block p-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    {item}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 p-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{username}</span>
                </div> */}
                {isAdmin && (
                  <a href="/dashboard" className="block w-full p-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    Dashboard
                  </a>
                )}
                <a href="/profile" className="block w-full p-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  Profil Saya
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full p-3 text-center text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <a
                  href="/login"
                  className="block w-full p-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="block w-full p-3 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Daftar
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="flex-shrink-0">
            <img
              src="/assets/logo.png"
              className="h-10 w-10 rounded-xl"
              alt="Logo"
            />
          </a>

          <div className="hidden lg:flex items-center justify-center flex-1 gap-8 ml-24">
            {typedMenuData.menuItems.map((item) => (
              <div key={item} className="relative ml-5">
                {renderDesktopMenuItem(item)}
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <AuthButtons />
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {renderMobileMenu()}
    </>
  );
}