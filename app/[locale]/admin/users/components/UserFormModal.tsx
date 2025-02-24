import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: User) => void;
  user?: User;
  isEditing: boolean;
  t: (key: string) => string;
}

const UserFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isEditing,
  t
}) => {
  const initialValues = {
    _id: '',
    name: '',
    email: '',
    role: 'user' as const
  };

  const [formData, setFormData] = useState<User>(initialValues);

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData(initialValues);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6"
          >
            {/* ... بقية محتوى النموذج */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;