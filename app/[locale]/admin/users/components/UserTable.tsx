import React from "react";
import { motion } from "framer-motion";
import { User } from "./types";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

const UserTable = ({ users, onEdit, onDelete, t }: Props) => {
  return (
    <div className="rounded-xl border dark:border-gray-700 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-800 font-medium">
        <span>{t('name')}</span>
        <span>{t('email')}</span>
        <span>{t('role')}</span>
        <span>{t('status')}</span>
        <span>{t('actions')}</span>
      </div>

      {/* Rows */}
      <div className="divide-y dark:divide-gray-700">
        {users.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
          >
            {/* Mobile View */}
            <div className="md:hidden col-span-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(user._id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block truncate dark:text-gray-200">{user.name}</div>
            <div className="hidden md:block truncate text-blue-600 dark:text-blue-400">
              {user.email}
            </div>
            <div className="hidden md:block capitalize">{user.role}</div>
            <div className="hidden md:block">
              <span className={`px-2 py-1 rounded-full text-sm ${
                user.status === 'active' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {user.status || 'N/A'}
              </span>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => onEdit(user)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('edit')}
              </button>
              <button
                onClick={() => onDelete(user._id)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                {t('delete')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;