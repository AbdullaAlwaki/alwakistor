"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "./components/ProductTable";
import ProductFormModal from "./components/ProductFormModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import LoadingIndicator from "./components/LoadingIndicator";
import { useTranslation } from "../../useTranslation"; // تأكد من المسار الصحيح
import { Product, ModalMode } from "./components/types"; // استيراد الواجهة الموحدة

export default function ManageProducts({ params }: { params: Promise<{ locale: string }> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [isModalOpen, setIsModalOpen] = useState(false); // حالة فتح نافذة النموذج
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // حالة فتح نافذة التأكيد
  const [error, setError] = useState<string | null>(null);

 const [locale, setLocale] = React.useState<string>('en');
   const { t } = useTranslation(locale);
 
   React.useEffect(() => {
     if (params) {
       params.then((unwrappedParams) => {
         setLocale(unwrappedParams.locale);
       });
     }
   }, [params]);
  // جلب المنتجات من الـ API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // إرسال بيانات النموذج (إنشاء أو تعديل)
  const handleSubmit = async (formData: Product) => {
    setLoading(true);
    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const body =
        modalMode === "create"
          ? formData // لإنشاء منتج جديد
          : { ...formData, id: selectedProduct?._id }; // لتعديل منتج موجود

      if (modalMode === "edit" && !selectedProduct?._id) {
        throw new Error("Product ID is missing.");
      }

      const response = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      await fetchProducts(); // تحديث القائمة بعد الإرسال
      setIsModalOpen(false); // إغلاق النافذة بعد الإرسال
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // حذف المنتج
  const handleDelete = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedProduct._id }), // تمرير المعرف في جسم الطلب
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Delete failed");
      }

      await fetchProducts(); // تحديث القائمة بعد الحذف
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* مؤشر التحميل */}
      {loading && <LoadingIndicator />}

      {/* رسالة الخطأ */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded mb-4 p-2">
          {error}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t("admin.products.title") || "Manage Products"}
          </h1>
          <button
            onClick={() => {
              setModalMode("create"); // وضع النموذج لإنشاء منتج جديد
              setSelectedProduct(undefined); // مسح المنتج المحدد
              setIsModalOpen(true); // فتح نافذة النموذج
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t("admin.products.addProduct") || "Add New Product +"}
          </button>
        </header>

        {/* جدول المنتجات */}
        {!loading && !error && (
          <ProductTable
            products={products}
            onEdit={(product) => {
              setModalMode("edit"); // وضع النموذج لتعديل المنتج
              setSelectedProduct(product); // تحديد المنتج المراد تعديله
              setIsModalOpen(true); // فتح نافذة النموذج
            }}
            onDelete={(id) => {
              const product = products.find((p) => p._id === id);
              console.log("Selected product for deletion:", product); // تسجيل المنتج المحدد
              setSelectedProduct(product);
              setIsDeleteOpen(true); // فتح نافذة تأكيد الحذف
            }}
            t={t}
          />
        )}

        {/* نافذة النموذج */}
        <ProductFormModal
          isOpen={isModalOpen} // حالة فتح النافذة
          onClose={() => setIsModalOpen(false)} // إغلاق النافذة
          onSubmit={handleSubmit} // إرسال البيانات
          product={selectedProduct} // المنتج المراد تعديله (اختياري)
          mode={modalMode} // وضع النموذج (إنشاء أو تعديل)
          t={t} // دالة الترجمة
        />

        {/* نافذة تأكيد الحذف */}
        <DeleteConfirmation
          isOpen={isDeleteOpen} // حالة فتح النافذة
          onConfirm={handleDelete} // تأكيد الحذف
          onCancel={() => setIsDeleteOpen(false)} // إلغاء الحذف
          productName={selectedProduct?.name || "Unnamed Product"} // اسم المنتج
          t={t} // دالة الترجمة
        />
      </div>
    </div>
  );
}