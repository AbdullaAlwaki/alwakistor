"use client";
import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import LoadingIndicator from "./components/LoadingIndicator";
import { User, ModalMode } from "./components/types";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const formattedUsers = data.data.map((user: User) => ({
        ...user,
        emailVerificationTokenCreatedAt: user.emailVerificationTokenCreatedAt 
          ? new Date(user.emailVerificationTokenCreatedAt).toLocaleString()
          : 'N/A'
      }));
      
      setUsers(formattedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (formData: User) => {
    setLoading(true);
    try {
      const method = modalMode === 'create' ? "POST" : "PUT";
      const response = await fetch("/api/admin/users", {
        method : method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Request failed");
      await fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser._id }),
      });

      if (!response.ok) throw new Error("Delete failed");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {loading && <LoadingIndicator />}
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage application users and permissions
            </p>
          </div>
          <button
            onClick={() => {
              setModalMode('create');
              setSelectedUser(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Add New User +
          </button>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <UserTable
            users={users}
            onEdit={(user) => {
              setModalMode('edit');
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
            onDelete={(id) => {
              setSelectedUser(users.find((u) => u._id === id));
              setIsDeleteOpen(true);
            }}
          />
        )}

        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          user={selectedUser}
          mode={modalMode}
        />

        <DeleteConfirmation
          isOpen={isDeleteOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
          userName={selectedUser?.name || ""}
        />
      </div>
    </div>
  );
}