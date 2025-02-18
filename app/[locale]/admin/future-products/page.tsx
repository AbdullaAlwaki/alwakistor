"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../../../[locale]/useTranslation";
import ProductTable from "./components/ProductTable"; // ✅ إعادة استخدام مكون الجدول
import ProductFormModal from "./components/ProductFormModal"; // ✅ إعادة استخدام مكون النموذج
import DeleteConfirmation from "./components/DeleteConfirmation"; // ✅ إعادة استخدام مكون الحذف
import LoadingIndicator from "./components/LoadingIndicator"; // ✅ إعادة استخدام مؤشر التحميل

export default function ManageFutureProducts({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const [futureProducts, setFutureProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    releaseDate: "", // ✅ إضافة حقل تاريخ الإصدار
  });
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

    // جلب المنتجات المستقبلية من الخادم
    fetch("/api/admin/future-products") // ✅ تغيير نقطة النهاية
      .then((res) => res.json())
      .then((data) => {
        console.log("Future Products:", data); // ✅ تسجيل البيانات للتحقق منها
        setFutureProducts(data.data || []); // ✅ التأكد من أن البيانات ليست غير معرفة
      })
      .catch((err) => {
        console.error("Error fetching future products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleAddProduct = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/future-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid server response.");
      }
  
      const data = await response.json();
      if (data.success) {
        setFutureProducts([...futureProducts, data.data]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding future product:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred while adding the future product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/future-products/${editingProduct._id}`, { // ✅ تغيير نقطة النهاية
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
        setFutureProducts(futureProducts.map((p) => (p._id === editingProduct._id ? data.data : p)));
        setEditingProduct(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating future product:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred while updating the future product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productIdToDelete) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/future-products/${productIdToDelete}`, { // ✅ تغيير نقطة النهاية
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Invalid server response.");
      }

      const data = await response.json();
      if (data.success) {
        setFutureProducts(futureProducts.filter((p) => p._id !== productIdToDelete));
        setIsDeleteModalOpen(false);
      } else {
        alert(data.message || "Failed to delete future product.");
      }
    } catch (error) {
      console.error("Error deleting future product:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred while deleting the future product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {t('admin.futureProducts.title')} {/* ✅ تحديث الترجمة */}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('admin.futureProducts.description')}</p> {/* ✅ تحديث الترجمة */}
      </header>

      {/* زر إضافة منتج مستقبلي */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-8"
      >
        {t('admin.futureProducts.addProduct')} {/* ✅ تحديث الترجمة */}
      </button>

      {loading && <LoadingIndicator />}

      {!loading && (
        <ProductTable
          products={futureProducts} // ✅ عرض المنتجات المستقبلية فقط
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