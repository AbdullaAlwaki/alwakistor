// app/components/ProductTable.tsx
"use client";
import React, {
  memo,
  useState,
  useCallback,
  useDeferredValue,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Product } from "./types";
import SkeletonLoader from "./SkeletonLoader";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  t?: (key: string) => string;
}

interface SortConfig {
  key: keyof Product;
  dir: "asc" | "desc";
}

const ProductImage = memo(
  ({ imageUrl, name, t }: { imageUrl?: string; name: string; t?: (key: string) => string }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group overflow-hidden shadow-lg w-20 h-20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center" // تصغير حجم الصورة
    >
      <img
        src={imageUrl || "/placeholder-product.jpg"}
        alt={t?.("admin.table.productImageAlt") || "Product Image"}
        className="w-full h-full object-contain p-1 transition-opacity opacity-90 hover:opacity-100"
        loading="lazy"
      />
      <div className="absolute inset-0 border border-gray-200 dark:border-gray-600 pointer-events-none" />
    </motion.div>
  )
);

const PriceBadge = memo(({ price, t }: { price: number; t?: (key: string) => string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold" // تكبير الخط
  >
    ${price.toFixed(2)}
  </motion.div>
));

interface TableHeaderCellProps {
  children: string;
  sortKey?: keyof Product;
  onSort?: (key: keyof Product) => void;
  currentSort?: SortConfig;
  t?: (key: string) => string;
  className?: string;
}

const TableHeaderCell = memo(
  ({ children, sortKey, onSort, currentSort, t, className }: TableHeaderCellProps) => (
    <div
      className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group ${className}`}
      onClick={sortKey && onSort ? () => onSort(sortKey) : undefined}
    >
      <span className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide group-hover:text-gray-900 dark:group-hover:text-white">
        {t?.(children.toLowerCase()) || children}
      </span>
      {sortKey && currentSort?.key === sortKey && (
        <div className="ml-1">
          {currentSort.dir === "asc" ? (
            <ArrowUpIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>
      )}
    </div>
  )
);

const ProductRow = memo(
  ({
    product,
    onEdit,
    onDelete,
    t,
  }: {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    t?: (key: string) => string;
  }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 shadow-sm transition-all rounded-none border-b dark:border-gray-700 text-sm" // تكبير الخط
    >
      {/* Mobile View */}
      <div className="md:hidden col-span-12 space-y-3">
        <div className="flex justify-between items-start gap-3">
          <ProductImage imageUrl={product.imageUrl} name={product.name} t={t} />
          <PriceBadge price={product.price} t={t} />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold dark:text-white">{product.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {product.description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {t?.("admin.table.createdAt") || "Created"}
            </span>
            <span className="block dark:text-white">
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {t?.("admin.table.updatedAt") || "Updated"}
            </span>
            <span className="block dark:text-white">
              {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md transition-colors dark:bg-blue-900/30"
            aria-label={t?.("admin.table.edit") || "Edit"}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors dark:bg-red-900/30"
            aria-label={t?.("admin.table.delete") || "Delete"}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex col-span-4 items-center gap-4 px-4">
        <ProductImage imageUrl={product.imageUrl} name={product.name} t={t} />
        <div className="flex-1">
          <h3 className="font-semibold dark:text-white mb-1">{product.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 pr-2">
            {product.description}
          </p>
        </div>
      </div>
      <div className="hidden md:flex col-span-2 items-center">
        <PriceBadge price={product.price} t={t} />
      </div>
      <div className="hidden md:flex col-span-3 items-center">
        <span className="text-gray-500 dark:text-gray-400">
          {new Date(product.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="hidden md:flex col-span-2 items-center">
        <span className="text-gray-500 dark:text-gray-400">
          {new Date(product.updatedAt).toLocaleDateString()}
        </span>
      </div>
      <div className="hidden md:flex col-span-1 items-center justify-end pr-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md transition-colors dark:bg-blue-900/30"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors dark:bg-red-900/30"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
);

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  isLoading,
  t,
}: ProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    dir: "asc",
  });

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const handleSort = useCallback((key: keyof Product) => {
    setSortConfig((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((p) => {
        const search = deferredSearchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(search) ||
          (p.description?.toLowerCase()?.includes(search) ?? false)
        );
      })
      .sort((a, b) => {
        const key = sortConfig.key;
        const aValue = a[key] ?? "";
        const bValue = b[key] ?? "";

        if (typeof aValue === "string" && typeof bValue === "string") {
          const aDate = new Date(aValue).getTime();
          const bDate = new Date(bValue).getTime();

          if (!isNaN(aDate) && !isNaN(bDate)) {
            return sortConfig.dir === "asc" ? aDate - bDate : bDate - aDate;
          }
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.dir === "asc" ? aValue - bValue : bValue - aValue;
        }

        return sortConfig.dir === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
  }, [products, deferredSearchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const showPagination = totalPages > 1;

  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [filteredProducts, currentPage]
  );

  return (
    <div className="border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden rounded-lg text-sm">
      {/* Header Section */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {t?.("admin.table.productCatalog") || "Product Catalog"}
          </h2>
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder={t?.("admin.table.searchProducts") || "Search products..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-3 p-3 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
        <TableHeaderCell 
          sortKey="name" 
          onSort={handleSort} 
          currentSort={sortConfig} 
          t={t}
          className="col-span-4 pl-4"
        >
          {t?.("admin.table.productDetails") || "PRODUCT DETAILS"}
        </TableHeaderCell>
        
        <TableHeaderCell 
          sortKey="price" 
          onSort={handleSort} 
          currentSort={sortConfig} 
          t={t}
          className="col-span-2"
        >
          {t?.("admin.table.price") || "PRICE"}
        </TableHeaderCell>
        
        <TableHeaderCell 
          sortKey="createdAt" 
          onSort={handleSort} 
          currentSort={sortConfig} 
          t={t}
          className="col-span-3"
        >
          {t?.("admin.table.createdAt") || "CREATED AT"}
        </TableHeaderCell>
        
        <TableHeaderCell 
          sortKey="updatedAt" 
          onSort={handleSort} 
          currentSort={sortConfig} 
          t={t}
          className="col-span-2"
        >
          {t?.("admin.table.updatedAt") || "UPDATED AT"}
        </TableHeaderCell>
        
        <div className="col-span-1 text-right">
          <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
            {t?.("admin.table.actions") || "ACTIONS"}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-3">
          <SkeletonLoader
            count={productsPerPage}
            className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && paginatedProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 text-center text-gray-500 dark:text-gray-400"
        >
          <div className="text-2xl mb-2">📭</div>
          <p className="text-base">{t?.("admin.table.noProducts") || "No products found"}</p>
        </motion.div>
      )}

      {/* Product Rows */}
      <AnimatePresence mode="popLayout">
        <div className="divide-y dark:divide-gray-700">
          {paginatedProducts.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              t={t}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {showPagination && (
        <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400">
            {t?.("admin.table.showingResults") || 
              `Showing ${paginatedProducts.length} of ${filteredProducts.length} results`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 transition-all"
            >
              {t?.("admin.table.previous") || "Previous"}
            </button>
            <span className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 transition-all"
            >
              {t?.("admin.table.next") || "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;