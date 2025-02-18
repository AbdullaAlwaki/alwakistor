import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import FutureProduct from "../../../../../models/FutureProduct"; // ✅ استخدام نموذج المنتجات المستقبلية

export async function PUT(request: NextRequest, { params }: { params: Record<string, string> }) {
  try {
    await dbConnect(); // الاتصال بقاعدة البيانات

    // استخراج المعرف من `params`
    const id = params.id;

    // التحقق من صحة `id`
    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required." }, { status: 400 });
    }

    // استخراج البيانات من الطلب
    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    // تحديث المنتج في قاعدة البيانات
    const updatedProduct = await FutureProduct.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl },
      { new: true }
    );

    // التحقق من نجاح التحديث
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
