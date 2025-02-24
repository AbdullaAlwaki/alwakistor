"use client";
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  memo, 
  createContext, 
  useContext 
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { Noto_Sans_Arabic } from "next/font/google";

const arabicFont = Noto_Sans_Arabic({ 
  subsets: ["arabic"], 
  weight: ["400", "600"],
  display: 'swap',
});

interface NavItem {
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  badge?: number;
}

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
});

const UserProfile = memo(() => (
  <div className="flex items-center gap-3 p-4 mb-6 bg-gradient-to-l from-blue-600 to-purple-600 rounded-xl shadow-lg">
    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
      <span className="text-white font-bold text-xl">A</span>
    </div>
    <div className="text-white">
      <h3 className="font-semibold text-lg">أحمد محمد</h3>
      <p className="text-xs opacity-90">مدير النظام</p>
    </div>
  </div>
));

const LogoutButton = memo(() => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
    aria-label="تسجيل الخروج"
  >
    <ArrowLeftOnRectangleIcon className="w-6 h-6 text-red-500" />
    <span className="text-sm font-medium">تسجيل الخروج</span>
  </motion.button>
));

const NavLink = memo(({ item }: { item: NavItem }) => {
  const { isCollapsed } = useContext(SidebarContext);
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        href={item.path}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-l from-blue-600 to-purple-600 text-white shadow-lg"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        } ${arabicFont.className}`}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-current"}`} />
        <span className={`text-sm font-semibold flex-1 ${
          isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
        } transition-opacity duration-300`}>
          {item.label}
        </span>
        {item.badge && !isCollapsed && (
          <span className="ml-2 px-2 py-1 text-xs font-bold bg-red-500/90 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    </motion.div>
  );
});

const MobileSidebar = memo(({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) => {
  const pathname = usePathname();
  const NAV_ITEMS: NavItem[] = [
    { path: "/admin/dashboard", icon: HomeIcon, label: "الرئيسية" },
    { path: "/admin/products", icon: CubeIcon, label: "المنتجات", badge: 5 },
    { path: "/admin/orders", icon: ShoppingCartIcon, label: "الطلبات", badge: 12 },
    { path: "/admin/analytics", icon: ChartBarIcon, label: "التحليلات" },
    { path: "/admin/users", icon: UsersIcon, label: "المستخدمين" },
    { path: "/admin/settings", icon: Cog6ToothIcon, label: "الإعدادات" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", bounce: 0.15 }}
          className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 p-4 shadow-2xl"
          role="navigation"
          aria-label="القائمة الجانبية"
        >
          <div className="flex justify-between items-center mb-8">
            <UserProfile />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="إغلاق القائمة"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <nav className="space-y-3">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <LogoutButton />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
});

const Sidebar = memo(() => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [isMobile, isMobileOpen]);

  const handleCloseMobile = useCallback(() => setIsMobileOpen(false), []);
  const toggleCollapse = useCallback(() => setIsCollapsed(prev => !prev), []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(prev => !prev)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="فتح/إغلاق القائمة"
        >
          {isMobileOpen ? (
            <XMarkIcon className="w-7 h-7 text-gray-800 dark:text-white" />
          ) : (
            <Bars3Icon className="w-7 h-7 text-gray-800 dark:text-white" />
          )}
        </button>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block ${
          isCollapsed ? 'w-20' : 'w-64'
        } min-h-screen bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-all duration-300`}
        role="navigation"
        aria-label="القائمة الجانبية الرئيسية"
      >
        <div className={`${isCollapsed ? 'justify-center' : 'justify-end'} flex mb-6 p-2`}>
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="p-2">
            <UserProfile />
            <nav className="space-y-2">
              {[
                { path: "/admin/dashboard", icon: HomeIcon, label: "الرئيسية" },
                { path: "/admin/products", icon: CubeIcon, label: "المنتجات", badge: 5 },
                { path: "/admin/orders", icon: ShoppingCartIcon, label: "الطلبات", badge: 12 },
                { path: "/admin/analytics", icon: ChartBarIcon, label: "التحليلات" },
                { path: "/admin/users", icon: UsersIcon, label: "المستخدمين" },
                { path: "/admin/settings", icon: Cog6ToothIcon, label: "الإعدادات" },
              ].map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <LogoutButton />
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileOpen} onClose={handleCloseMobile} />
    </SidebarContext.Provider>
  );
});

export default Sidebar;