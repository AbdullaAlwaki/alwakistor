"use client";

import React from "react";

interface DeleteConfirmationProps {
  onDelete: () => void;
  onCancel: () => void;
  t: any; // ترجمة
}

export default function DeleteConfirmation({ onDelete, onCancel, t }: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-gray-800 dark:text-gray-200 mb-4">{t('admin.products.confirmDelete')}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            {t('admin.products.actions.delete')}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            {t('admin.products.form.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}