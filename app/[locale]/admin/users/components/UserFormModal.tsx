import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ModalMode } from './types';
import { XMarkIcon } from '@heroicons/react/24/outline';

const UserFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user, 
  mode 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: User) => void;
  user?: User;
  mode: ModalMode;
}) => {
  const initialValues: User = {
    _id: '',
    name: '',
    email: '',
    role: 'user',
    emailVerified: false,
    emailVerificationToken: null,
    emailVerificationTokenCreatedAt: null,
  };

  const [formData, setFormData] = React.useState<User>(initialValues);

  useEffect(() => {
    setFormData(user || initialValues);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">
                  {mode === 'create' ? 'Create New User' : 'Edit User'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                      Role
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                      Email Verification
                    </label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={formData.emailVerified ? 'verified' : 'unverified'}
                      onChange={(e) => setFormData({ ...formData, emailVerified: e.target.value === 'verified' })}
                    >
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {mode === 'create' ? 'Create User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;