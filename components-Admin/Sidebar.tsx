"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  createContext,
  useContext,
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
import { useTranslation } from "../app/[locale]/useTranslation";

// Translation function type
type TranslateFunction = (key: string) => string;

const arabicFont = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  display: "swap",
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

const UserProfile = memo(({ t }: { t: TranslateFunction }) => (
  <div className="flex items-center gap-3 p-4 mb-6 bg-gradient-to-l from-blue-600 to-purple-600 rounded-xl shadow-lg">
    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
      <span className="text-white font-bold text-xl">A</span>
    </div>
    <div className="text-white">
      <h3 className="font-semibold text-lg">
        {t("admin.sidebar.name") || "Admin"}
      </h3>
      <p className="text-xs opacity-90">
        {t("admin.sidebar.role") || "Super Admin"}
      </p>
    </div>
  </div>
));

const LogoutButton = memo(({ t }: { t: TranslateFunction }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
    aria-label={t("admin.sidebar.logout.ariaLabel") || "تسجيل الخروج"}
  >
    <ArrowLeftOnRectangleIcon className="w-6 h-6 text-red-500" />
    <span className="text-sm font-medium">
      {t("admin.sidebar.logout") || "تسجيل الخروج"}
    </span>
  </motion.button>
));

const NavLink = memo(({ item, t }: { item: NavItem; t: TranslateFunction }) => {
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
        <Icon
          className={`w-6 h-6 ${isActive ? "text-white" : "text-current"}`}
        />
        <span
          className={`text-sm font-semibold flex-1 ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          } transition-opacity duration-300`}
        >
          {t(`admin.sidebar.${item.label}`) || item.label}
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

const MobileSidebar = memo(
  ({
    isOpen,
    onClose,
    t,
  }: {
    isOpen: boolean;
    onClose: () => void;
    t: TranslateFunction;
  }) => {
    const NAV_ITEMS: NavItem[] = [
      { path: "/admin/dashboard", icon: HomeIcon, label: "home" },
      { path: "/admin/products", icon: CubeIcon, label: "products", badge: 5 },
      {
        path: "/admin/orders",
        icon: ShoppingCartIcon,
        label: "orders",
        badge: 12,
      },
      { path: "/admin/analytics", icon: ChartBarIcon, label: "analytics" },
      { path: "/admin/users", icon: UsersIcon, label: "users" },
      { path: "/admin/settings", icon: Cog6ToothIcon, label: "settings" },
    ];
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[999] bg-black/50 lg:hidden"
            onClick={onClose}
          >
            <motion.aside
              className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <UserProfile t={t} />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  aria-label={
                    t("admin.sidebar.mobile.closeMenu") || "إغلاق القائمة"
                  }
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.path} item={item} t={t} />
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <LogoutButton t={t} />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

const Sidebar = memo(({ params }: { params: Promise<{ locale: string }> }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [locale, setLocale] = React.useState<string>("ar");
  const { t } = useTranslation(locale);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMobileOpen]);

  const toggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileOpen((prev) => !prev),
    []
  );

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {/* زر الهمبرجر المعدل */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 right-4 z-[1000] p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl lg:hidden"
          onClick={toggleMobileMenu}
          aria-label={t("admin.sidebar.mobile.toggleMenu") || "قائمة التنقل"}
          style={{ zIndex: 1000 }}
        >
          {isMobileOpen ? (
            <XMarkIcon className="w-8 h-8 text-gray-800 dark:text-white" />
          ) : (
            <Bars3Icon className="w-8 h-8 text-gray-800 dark:text-white" />
          )}
        </motion.button>
      )}
      {/* سايدبار الديسكتوب */}
      <aside
        className={`hidden lg:block ${
          isCollapsed ? "w-20" : "w-64"
        } min-h-screen bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-all duration-300`}
      >
        <div
          className={`${
            isCollapsed ? "justify-center" : "justify-end"
          } flex mb-6 p-2`}
        >
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label={
              isCollapsed
                ? t("admin.sidebar.desktop.expandMenu") || "توسيع القائمة"
                : t("admin.sidebar.desktop.collapseMenu") || "طي القائمة"
            }
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
            <UserProfile t={t} />
            <nav className="space-y-2">
              {[
                { path: "/admin/dashboard", icon: HomeIcon, label: "home" },
                {
                  path: "/admin/products",
                  icon: CubeIcon,
                  label: "products",
                  badge: 5,
                },
                {
                  path: "/admin/orders",
                  icon: ShoppingCartIcon,
                  label: "orders",
                  badge: 12,
                },
                {
                  path: "/admin/analytics",
                  icon: ChartBarIcon,
                  label: "analytics",
                },
                { path: "/admin/users", icon: UsersIcon, label: "users" },
                {
                  path: "/admin/settings",
                  icon: Cog6ToothIcon,
                  label: "settings",
                },
              ].map((item) => (
                <NavLink key={item.path} item={item} t={t} />
              ))}
            </nav>
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <LogoutButton t={t} />
            </div>
          </div>
        )}
      </aside>
      {/* قائمة الجوال */}
      <MobileSidebar isOpen={isMobileOpen} onClose={toggleMobileMenu} t={t} />
    </SidebarContext.Provider>
  );
});

export default Sidebar;
