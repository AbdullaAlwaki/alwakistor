"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from '../../../[locale]/useTranslation';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import DeleteConfirmation from './components/DeleteConfirmation';
import LoadingIndicator from './components/LoadingIndicator';

export default function ManageProducts({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, imageUrl: "" });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }

    // جلب المنتجات من الخادم
    fetch("/api/admin/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products.");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [params]);

  const handleAddProduct = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Invalid server response.");
      }
  
      const data = await response.json();
      if (data.success) {
        setProducts([...products, data.data]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Invalid server response.");
      }
  
      const data = await response.json();
      if (data.success) {
        setProducts(products.map((p) => (p._id === editingProduct._id ? data.data : p)));
        setEditingProduct(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };

 

  const handleDeleteProduct = async () => {
    if (!productIdToDelete) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Invalid server response.");
      }

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== productIdToDelete));
        setIsDeleteModalOpen(false);
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred while deleting the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {t('admin.products.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('admin.products.description')}</p>
      </header>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-8"
      >
        {t('admin.products.addProduct')}
      </button>

      {loading && <LoadingIndicator />}

      {!loading && (
        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
          onDelete={(id) => {
            setProductIdToDelete(id);
            setIsDeleteModalOpen(true);
          }}
          t={t}
        />
      )}

      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setEditingProduct(null);
            setIsModalOpen(false);
          }}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          product={editingProduct || newProduct}
          isEditing={!!editingProduct}
          t={t}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmation
          onDelete={handleDeleteProduct}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setProductIdToDelete(null);
          }}
          t={t}
        />
      )}
    </div>
  );
}