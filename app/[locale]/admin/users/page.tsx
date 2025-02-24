"use client";
import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import LoadingSpinner from "./components/LoadingSpinner";
import { User } from "./components/types";

export default function ManageUsers() {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        setUsers(data.data || []);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData: User) => {
    setLoading(true);
    try {
      const isEdit = !!selectedUser;
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/admin/users/${selectedUser._id}` : '/api/admin/users';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Request failed');

      const data = await response.json();
      
      setUsers(prev => isEdit
        ? prev.map(u => u._id === data.data._id ? data.data : u)
        : [...prev, data.data]
      );
      
      setIsModalOpen(false);
      setSelectedUser(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (!selectedUser) return;
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');
      
      setUsers(prev => prev.filter(u => u._id !== selectedUser._id));
      setIsDeleteOpen(false);
      setSelectedUser(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage application users and permissions
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedUser(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Add New User +
          </button>
        </header>

        {/* Loading & Error States */}
        {loading && (
          <div className="flex justify-center mt-20">
            <LoadingSpinner size="lg" text="Loading users..." />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* User Table */}
        {!loading && !error && (
          <UserTable
            users={users}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
            onDelete={(id) => {
              setSelectedUser(users.find(u => u._id === id));
              setIsDeleteOpen(true);
            }}
          t={(key) => key.replace('_', ' ')}

          />
        )}

        {/* Modals */}
        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(undefined);
          }}
          onSubmit={handleSubmit}
          user={selectedUser}
          isEditing={!!selectedUser}
          t={(key) => key.replace('_', ' ')}
        />

        <DeleteConfirmation
          isOpen={isDeleteOpen}
          onConfirm={handleDelete}
          onCancel={() => {
            setIsDeleteOpen(false);
            setSelectedUser(undefined);
          }}
          userName={selectedUser?.name || ''}
          t={(key) => key.replace('_', ' ')}
        />
      </div>
    </div>
  );
}