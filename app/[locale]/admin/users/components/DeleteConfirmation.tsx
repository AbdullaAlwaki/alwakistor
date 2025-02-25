import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DeleteConfirmation = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  userName 
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Delete Confirmation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{userName}</strong>?
              </p>
              
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Confirm Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmation;