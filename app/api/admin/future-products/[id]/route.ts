import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import FutureProduct from "../../../../../models/FutureProduct"; // ✅ استخدام نموذج المنتجات المستقبلية

// الاتصال بقاعدة البيانات عند تشغيل أي طلب
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB

    // استخراج المعرف من `params`
    const { id } = params;

    // استخراج البيانات المرسلة في الطلب
    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    // تحديث المنتج المستقبلي
    const updatedProduct = await FutureProduct.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl },
      { new: true } // لاسترجاع المنتج بعد التحديث
    );

    // التحقق مما إذا تم العثور على المنتج
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    // إرجاع المنتج المُحدّث
    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);

    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
