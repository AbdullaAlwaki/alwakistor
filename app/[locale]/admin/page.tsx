"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [products, setProducts] = useState<{ id: number; name: string; description: string; price: number; imageUrl: string }[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  });
  const [editingProduct, setEditingProduct] = useState<{ id: number; name: string; description: string; price: number; imageUrl: string } | null>(null);
  const router = useRouter();

  // جلب جميع المنتجات
  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // إضافة منتج جديد
  const handleAddProduct = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      if (data.success) {
        setProducts([...products, data.data]);
        setNewProduct({ name: "", description: "", price: 0, imageUrl: "" });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // تعديل منتج موجود
  const handleEditProduct = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? data.data : p)));
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id: number) => {
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>

      {/* نموذج إضافة منتج */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">إضافة منتج جديد</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input
            type="text"
            placeholder="اسم المنتج"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="وصف المنتج"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="سعر المنتج"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="رابط الصورة"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            إضافة المنتج
          </button>
        </form>
      </div>

      {/* جدول عرض المنتجات */}
      <h2 className="text-xl font-bold mb-4">قائمة المنتجات</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">اسم المنتج</th>
            <th className="border p-2">الوصف</th>
            <th className="border p-2">السعر</th>
            <th className="border p-2">الصورة</th>
            <th className="border p-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.description || "-"}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" />
                )}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* نموذج تعديل المنتج */}
      {editingProduct && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">تعديل المنتج</h2>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <input
              type="text"
              placeholder="اسم المنتج"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="وصف المنتج"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="سعر المنتج"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="رابط الصورة"
              value={editingProduct.imageUrl}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              تحديث المنتج
            </button>
            <button
              onClick={() => setEditingProduct(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              إلغاء
            </button>
          </form>
        </div>
      )}
    </div>
  );
}