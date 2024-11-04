import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  GraduationCap,
  Compass,
  BookOpen,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

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

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string>("");
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "users",
      label: "User",
      icon: Users,
      path: "/dashboard/users",
    },
    {
      id: "products",
      label: "Product",
      icon: Package,
      path: "/dashboard/products",
      submenu: [
        { label: "Product List", path: "/dashboard/products-list" },
        { label: "Product Category", path: "/dashboard/product-category" },
      ],
    },
    // New Dropdown Menu for "Content" Section
    {
      id: "content",
      label: "Content",
      icon: BookOpen, // Use an appropriate icon
      path: "/content",
      submenu: [
        { label: "Tentang", path: "/dashboard/content/tentang" },
        { label: "Task", path: "/dashboard/content/task" },
        { label: "Fungsi", path: "/dashboard/content/funtion" },
        { label: "Visi Misi", path: "/dasboard/content/visi-misi" },
        { label: "Sejarah", path: "/dasboard/content/sejarah" },
        { label: "Struktur Organisasi", path: "/dasboard/content/struktur-organisasi" },
      ],
    },
    {
      id: "training",
      label: "Pelatihan & Workshop",
      icon: GraduationCap,
      path: "/training",
      submenu: [
        { label: "Daftar Pelatihan", path: "/training/list" },
        { label: "Jadwal", path: "/training/schedule" },
        { label: "Peserta", path: "/training/participants" },
      ],
    },
    {
      id: "education",
      label: "Wisata Edukasi",
      icon: Compass,
      path: "/education",
      submenu: [
        { label: "Destinasi", path: "/education/destinations" },
        { label: "Booking", path: "/education/bookings" },
        { label: "Review", path: "/education/reviews" },
      ],
    },
    {
      id: "articles",
      label: "Artikel",
      icon: BookOpen,
      path: "/articles",
    },
    {
      id: "services",
      label: "Layanan",
      icon: BookOpen,
      path: "/dashboard/services",
      submenu: [
        { label: "Services", path: "/dashboard/services" },
        { label: "Service Category", path: "/dashboard/service-category" },
      ],
    },
  ];
  
  

  const toggleSubmenu = (itemId: string): void => {
    setExpandedSubmenu(expandedSubmenu === itemId ? "" : itemId);
  };

  const menuItemClass = (isActive: boolean): string => `
    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
    ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}
    transition-all duration-200 ease-in-out
    ${isCollapsed ? "justify-center" : ""}
    w-full
  `;

  const submenuItemClass = (isActive: boolean): string => `
    pl-12 py-2 text-sm cursor-pointer
    ${isActive ? "text-blue-700" : "text-gray-700"} 
    hover:text-blue-700 transition-colors duration-200
    ${isCollapsed ? "hidden" : ""}
    block w-full
  `;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md mt-10"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 "
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl mt-24
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64 "}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Menu Items */}
        <nav className="py-4 px-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  <div
                    className={menuItemClass(
                      location.pathname.startsWith(item.path)
                    )}
                    onClick={() => toggleSubmenu(item.id)}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        location.pathname.startsWith(item.path)
                          ? "text-blue-700"
                          : "text-gray-500"
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
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          location.pathname === item.path
                            ? "text-blue-700"
                            : "text-gray-500"
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
                      {item.submenu.map((subItem) => (
                        <Link key={subItem.path} to={subItem.path}>
                          <div
                            className={submenuItemClass(
                              location.pathname === subItem.path
                            )}
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
      </aside>

      <div
        className={`${
          isCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300 ease-in-out`}
      />
    </>
  );
};

export default Sidebar;
