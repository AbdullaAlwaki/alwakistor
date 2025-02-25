// types.ts
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
  
  // واجهة نافذة تأكيد الحذف
  export interface DeleteConfirmationProps {
    isOpen: boolean; // حالة فتح النافذة
    onConfirm: () => void | Promise<void>; // دالة التأكيد (حذف العنصر)
    onCancel: () => void; // دالة الإلغاء
    t?: (key: string, params?: Record<string, string>) => string; // دعم المعلمات الإضافية
    productName?: string | null; // اسم المنتج المراد حذفه (اختياري)
  }
  
  // نوع وضع النموذج (إنشاء أو تعديل)
  export type ModalMode = "create" | "edit";