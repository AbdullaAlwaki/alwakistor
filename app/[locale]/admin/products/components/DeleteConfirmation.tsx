import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteConfirmationProps } from "./types"; // استيراد الواجهة الموحدة

export default function DeleteConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  productName,
  t,
}: DeleteConfirmationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
          >
            {/* Header مع أيقونة التحذير */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {t ? t('admin.products.deleteconfirmation') : "Confirm Deletion"}
              </h3>
            </div>


            {/* أزرار الإجراءات */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
              >
                {t ? t('admin.delete.cancel') : "Cancel"}
              </button>
              <button
                onClick={onConfirm} // استدعاء دالة التأكيد
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {t ? t('admin.delete.delete') : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}