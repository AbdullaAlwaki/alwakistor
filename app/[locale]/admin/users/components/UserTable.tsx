import React, { useState, useCallback, useDeferredValue, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "./types";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import StatusBadge from "./StatusBadge";
import SkeletonLoader from "./SkeletonLoader";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  t?: (key: string) => string;
}

const UserTable = ({ users, onEdit, onDelete, isLoading, t }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [users, deferredSearchTerm]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const showPagination = totalPages > 1;

  return (
    <div className="border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden rounded-none">
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t?.("admin.userTable.title") || "User Management"}
          </h2>
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder={t?.("admin.userTable.search") || "Search users..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
        <div className="col-span-3 font-medium pl-6">
          {t?.("admin.userTable.name") || "Name"}
        </div>
        <div className="col-span-3 font-medium">
          {t?.("admin.userTable.email") || "Email"}
        </div>
        <div className="col-span-2 font-medium">
          {t?.("admin.userTable.role") || "Role"}
        </div>
        <div className="col-span-2 font-medium">
          {t?.("admin.userTable.status") || "Status"}
        </div>
        <div className="col-span-2 pr-6 text-right font-medium">
          {t?.("admin.userTable.actions") || "Actions"}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-4">
          <SkeletonLoader
            count={usersPerPage}
            className="h-20 bg-gray-100 dark:bg-gray-800 rounded-none"
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && paginatedUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center text-gray-500 dark:text-gray-400"
        >
          <div className="text-3xl mb-2">👤</div>
          <p className="text-lg">
            {t?.("admin.userTable.noUsers") || "No users found"}
          </p>
        </motion.div>
      )}

      {/* User Rows */}
      <AnimatePresence mode="popLayout">
        <div className="divide-y dark:divide-gray-700">
          {paginatedUsers.map((user) => (
            <motion.div
              key={user._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 shadow-sm transition-all rounded-none"
            >
              {/* Mobile View */}
              <div className="md:hidden col-span-12 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-lg font-semibold dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">
                      {user.email}
                    </div>
                  </div>
                  <StatusBadge
                    status={user.emailVerified ? "verified" : "unverified"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t?.("admin.userTable.role") || "Role"}
                    </span>
                    <span className="block capitalize dark:text-white">
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t?.("admin.userTable.registered") || "Registered"}
                    </span>
                    <span className="block dark:text-white">
                      {new Date(
                        user.createdAt || new Date()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors dark:bg-blue-900/30"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(user._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors dark:bg-red-900/30"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:flex col-span-3 items-center gap-4 pl-6">
                <div className="flex-1">
                  <div className="font-semibold dark:text-white">
                    {user.name}
                  </div>
                </div>
              </div>
              <div className="hidden md:flex col-span-3 items-center">
                <span className="dark:text-white">{user.email}</span>
              </div>
              <div className="hidden md:flex col-span-2 items-center capitalize dark:text-white">
                {user.role}
              </div>
              <div className="hidden md:flex col-span-2 items-center">
                <StatusBadge
                  status={user.emailVerified ? "verified" : "unverified"}
                />
              </div>
              <div className="hidden md:flex col-span-2 items-center justify-end pr-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors dark:bg-blue-900/30"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(user._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors dark:bg-red-900/30"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {showPagination && (
        <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t?.("admin.userTable.showingResults") ||
              `Showing ${paginatedUsers.length} of ${filteredUsers.length} results`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 transition-all"
            >
              {t?.("admin.userTable.previous") || "Previous"}
            </button>
            <span className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 transition-all"
            >
              {t?.("admin.userTable.next") || "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
