import dbConnect from '../../../../../lib/mongodb';
import FutureProduct from '../../../../../models/FutureProduct'; // ✅ استخدام نموذج المنتجات المستقبلية
import { NextResponse } from 'next/server';

// الاتصال بقاعدة البيانات عند تشغيل أي طلب
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    const { id } = params;
    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    // تحديث المنتج
    const updatedProduct = await FutureProduct.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl },
      { new: true } // لاسترجاع المنتج بعد التحديث
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to update product.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}