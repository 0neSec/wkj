import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogOut, Settings, PanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

interface MenuItem {
  label: string;
  href: string;
  subMenu?: string[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [authState, setAuthState] = useState(authService.getAuthState());
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkAuthStatus = () => {
      setAuthState(authService.getAuthState());
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('focus', checkAuthStatus);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, []);

  const menuItems: MenuItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Identifikasi Tanaman", href: "/detection_tanaman" },
    { label: "Farmakope Herbal", href: "/product" },
    { label: "Central Jamu", href: "/central-jamu" },
    { label: "Produsen Jamu", href: "/produsen" },
  ];

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleDashboardNavigation = () => {
    const role = authService.getAuthState().role;
    if (role === 'admin') {
      navigate('/dashboard');
    }
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex justify-between items-center w-full lg:w-auto ">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <img
                src="assets/wkj.webp"
                alt="Logo"
                className="h-10 w-auto rounded-full"
              />
            </motion.div>
            
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex justify-center flex-1 ml-20">
            <div className="flex space-x-8">
              {menuItems.map((item, index) => (
                <div key={index} className="group relative">
                  <Link
                    to={item.href}
                    className="text-gray-800 hover:text-blue-600 font-semibold flex items-center transition duration-300"
                  >
                    {item.label}
                    {item.subMenu && <ChevronDown size={16} className="ml-1" />}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons / User Profile */}
          <div className="hidden lg:flex items-center space-x-6">
            {!authState.isAuthenticated ? (
              <>
                <motion.button
                  onClick={handleLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-300"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={handleRegister}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Register
                </motion.button>
              </>
            ) : (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-semibold">
                    {authState.username || 'Profile'}
                  </span>
                </motion.button>

                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border"
                  >
                    <div className="py-1">
                      <button
                        onClick={handleProfileNavigation}
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-blue-50 transition duration-300"
                      >
                        <Settings className="w-4 h-4 mr-3" /> Profile Settings
                      </button>
                      
                      {authState.role === 'admin' && (
                        <button
                          onClick={handleDashboardNavigation}
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-blue-50 transition duration-300"
                        >
                          <PanelLeft className="w-4 h-4 mr-3" /> 
                          Admin Dashboard
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-blue-50 text-red-600 hover:bg-red-50 transition duration-300"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMenu}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween" }}
                className="absolute right-0 top-0 w-[85%] h-full bg-white shadow-2xl p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col space-y-5 ml-10">
                  {menuItems.map((item, index) => (
                    <div key={index} className="border-b pb-3">
                      <div 
                        className="flex items-center justify-between"
                        onClick={() => item.subMenu && toggleSubMenu(item.label)}
                      >
                        <Link
                          to={item.href}
                          className="text-gray-800 hover:text-blue-600 font-semibold flex-grow"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenSubMenu(null);
                          }}
                        >
                          {item.label}
                        </Link>
                        {item.subMenu && (
                          <ChevronDown 
                            size={16} 
                            className={`text-gray-600 transition-transform ${
                              openSubMenu === item.label ? 'rotate-180' : ''
                            }`} 
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Mobile Authentication Section */}
                  {!authState.isAuthenticated ? (
                    <div className="pt-5 space-y-4">
                      <motion.button 
                        onClick={handleLogin}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-5 py-3 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-300"
                      >
                        Login
                      </motion.button>

                      <motion.button 
                        onClick={handleRegister}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                      >
                        Register
                      </motion.button>
                    </div>
                  ) : (
                    <div className="pt-5 space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <User className="w-6 h-6 text-blue-600" />
                        <span className="text-gray-800 font-semibold">
                          {authState.username || 'Profile'}
                        </span>
                      </div>

                      <motion.button 
                        onClick={handleProfileNavigation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-5 py-3 flex items-center justify-center text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-300"
                      >
                        <Settings className="w-4 h-4 mr-2" /> Profile Settings
                      </motion.button>

                      {authState.role === 'admin' && (
                        <motion.button 
                          onClick={handleDashboardNavigation}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-5 py-3 flex items-center justify-center bg-blue-50 text-blue-800 rounded-full hover:bg-blue-100 transition duration-300"
                        >
                          <PanelLeft className="w-4 h-4 mr-2" /> 
                          Admin Dashboard
                        </motion.button>
                      )}

                      <motion.button 
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-5 py-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition duration-300"
                      >
                        <LogOut className="w-4 h-4 mr-2 inline-block" /> Logout
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;