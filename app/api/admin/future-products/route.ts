import dbConnect from '../../../../lib/mongodb';
import FutureProduct from '../../../../models/FutureProduct'; // ✅ استخدام نموذج المنتجات المستقبلية
import { NextResponse } from 'next/server';

// الاتصال بقاعدة البيانات عند تشغيل أي طلب
export async function GET() {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    // جلب جميع المنتجات المستقبلية
    const futureProducts = await FutureProduct.find();
    return NextResponse.json({ success: true, data: futureProducts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching future products:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch future products.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    const body = await request.json();
    const { name, description, price, imageUrl, releaseDate } = body;

    // التحقق من صحة البيانات
    if (!name || !price || !releaseDate) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and release date are required.' },
        { status: 400 }
      );
    }

    // إنشاء منتج مستقبلي جديد
    const product = await FutureProduct.create({
      name,
      description,
      price,
      imageUrl,
      releaseDate,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating future product:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to create future product.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// تعديل منتج مستقبلي موجود
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    const { id } = params;
    const body = await request.json();
    const { name, description, price, imageUrl, releaseDate } = body; // ✅ إضافة حقل تاريخ الإصدار

    // تحديث المنتج المستقبلي
    const updatedProduct = await FutureProduct.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl, releaseDate }, // ✅ تحديث الحقول بما في ذلك تاريخ الإصدار
      { new: true } // لاسترجاع المنتج بعد التحديث
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Future product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error updating future product:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to update future product.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// حذف منتج مستقبلي
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    const { id } = params;

    // حذف المنتج المستقبلي
    const deletedProduct = await FutureProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: 'Future product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Future product deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting future product:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to delete future product.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}