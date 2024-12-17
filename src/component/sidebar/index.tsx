import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  GraduationCap,
  BookOpen,
  ChevronDown,
  Menu,
  X,
  FileText,
  Newspaper,
  Wrench,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Search,
  Home,
  UserCircle,
  LogOut,
  Settings,
  Megaphone,
  Building2,
  ShoppingBag
} from "lucide-react";
import { authService } from "../../services/auth.service";

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  submenu?: SubMenuItem[];
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  
  const menuItems: MenuItem[] = [
    {
      id: "beranda",
      label: "Beranda",
      icon: Home,
      path: "/",
    },
    {
      id: "dashboard",
      label: "Dasbor",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "users",
      label: "Pengguna",
      icon: Users,
      path: "/dashboard/users",
    },
    {
      id: "products",
      label: "Produk",
      icon: ShoppingBag,
      path: "/dashboard/",
      submenu: [
        { label: "Daftar Produk", path: "/dashboard/products" },
        { label: "Kategori Produk", path: "/dashboard/products/category" },
      ],
    },
    {
      id: "productStore",
      label: "Herbal Store", // New Product Store Menu
      icon: ShoppingBag, // You can use the same icon or a new one
      path: "/dashboard/store", // Set the path for the herbal store
    },
    {
      id: "content",
      label: "Manajemen Konten",
      icon: BookOpen,
      path: "/dashboard/content",
      submenu: [
        { label: "Tentang Kami", path: "/dashboard/content/tentang" },
        { label: "Tugas", path: "/dashboard/content/task" },
        { label: "Fungsi", path: "/dashboard/content/fungsi" },
        { label: "Visi", path: "/dashboard/content/visi" },
        { label: "Misi", path: "/dashboard/content/misi" },
        { label: "Sejarah", path: "/dashboard/content/sejarah" },
        { label: "Struktur Organisasi", path: "/dashboard/content/struktur" },
      ],
    },
    {
      id: "banner",
      label: "Banner",
      icon: Wrench,
      path: "/dashboard/banner",
    },
    {
      id: "footer",
      label: "Footer",
      icon: ClipboardList,
      path: "/dashboard/footer",
      submenu: [
        { label: "Alamat", path: "/dashboard/footer/alamat" },
        { label: "Maps", path: "/dashboard/footer/maps" },
        { label: "Kontak", path: "/dashboard/footer/contact" },
        { label: "Timeline", path: "/dashboard/footer/timeline" },
        { label: "Social Media", path: "/dashboard/footer/social-media" },
      ],
    },
  ];
  

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.submenu?.some(subItem => 
      subItem.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setExpandedSubmenu(""); // Close all submenus when collapsing
  };

  const toggleSubmenu = (itemId: string): void => {
    setExpandedSubmenu(expandedSubmenu === itemId ? "" : itemId);
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, item: MenuItem) => {
    if (event.key === 'Enter') {
      if (item.submenu) {
        toggleSubmenu(item.id);
      }
    }
  };

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Focus search input when sidebar expands
  useEffect(() => {
    if (!isCollapsed && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isCollapsed]);

  const menuItemClass = (isActive: boolean): string => `
    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
    group
    ${isActive 
      ? "bg-blue-100 text-blue-800 hover:bg-blue-200" 
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
    transition-all duration-200 ease-in-out
    ${isCollapsed ? "justify-center" : ""}
    w-full
    relative
  `;

  const submenuItemClass = (isActive: boolean): string => `
    pl-12 py-2 text-sm cursor-pointer
    group-hover:bg-gray-50
    ${isActive 
      ? "text-blue-800 bg-blue-50" 
      : "text-gray-700 hover:text-blue-800"} 
    transition-colors duration-200
    ${isCollapsed ? "hidden" : ""}
    block w-full
  `;

  useEffect(() => {
    const { isAuthenticated, username, role } = authService.getAuthState();
    
    if (isAuthenticated) {
      setUsername(username);
      setRole(role);
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const UserProfileSection = () => {
    if (isCollapsed) return null;
  
    return (
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <UserCircle className="w-10 h-10 text-gray-500" />
          <div>
            <p className="font-semibold text-gray-800">{username || 'User'}</p>
            <p className="text-xs text-gray-500">{role || 'Role'}</p>
          </div>
          <div className="ml-auto flex">
            <button 
              className="hover:bg-gray-100 p-2 rounded-full ml-10"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden fixed  left-4 z-50 p-2 bg-white rounded-lg shadow-md mt-5"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        aria-label="Sidebar navigation"
      >
        {/* Navbar Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 h-24">
          {/* Logo */}
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo.webp" 
                alt="Logo" 
                className="h-10 w-auto"
              />
              <h1 className="text-xl font-bold text-gray-800">WKJ KALIBAKUNG</h1>
            </div>
          )}

          {/* Sidebar Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Search Input */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari menu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                aria-label="Search menu items"
              />
              <Search className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        )}

        {/* Scrollable Menu Items */}
        <div className="h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
          <nav className="py-4 px-2">
            <div className="space-y-1">
              {filteredMenuItems.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    <div
                      className={menuItemClass(
                        location.pathname.startsWith(item.path)
                      )}
                      onClick={() => toggleSubmenu(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      tabIndex={0}
                      role="button"
                      aria-expanded={expandedSubmenu === item.id}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          location.pathname.startsWith(item.path)
                            ? "text-blue-800"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 
                              ${expandedSubmenu === item.id ? "rotate-180" : ""}`}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <Link to={item.path}>
                      <div
                        className={menuItemClass(location.pathname === item.path)}
                        aria-current={location.pathname === item.path ? "page" : undefined}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            location.pathname === item.path
                              ? "text-blue-800"
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="flex-1">{item.label}</span>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.submenu &&
                    expandedSubmenu === item.id &&
                    !isCollapsed && (
                      <div className="mt-1 space-y-1">
                        {item.submenu
                          .filter(subItem => 
                            subItem.label.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((subItem) => (
                            <Link key={subItem.path} to={subItem.path}>
                              <div
                                className={submenuItemClass(
                                  location.pathname === subItem.path
                                )}
                                aria-current={location.pathname === subItem.path ? "page" : undefined}
                              >
                                {subItem.label}
                              </div>
                            </Link>
                          ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        <UserProfileSection />
      </aside>

      {/* Content Offset */}
      <div
        className={`${
          isCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300 ease-in-out`}
      />
    </>
  );
};

export default Sidebar;