import dbConnect from '../../../../lib/mongodb';
import FutureProduct from '../../../../models/FutureProduct';
import { NextResponse } from 'next/server';

// الاتصال بقاعدة البيانات عند تشغيل أي طلب
export async function GET() {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    // جلب جميع المنتجات
    const products = await FutureProduct.find();
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch products.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// إضافة منتج جديد
export async function POST(request: Request) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    const body = await request.json();
    const { name, description, price, imageUrl } = body;
    // التحقق من صحة البيانات
    if (!name || !price) {
      return NextResponse.json({ success: false, message: 'Name and price are required.' }, { status: 400 });
    }
    // إنشاء منتج جديد
    const product = await FutureProduct.create({
      name,
      description,
      price,
      imageUrl,
    });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to create product.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// تعديل منتج موجود
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

// حذف منتج
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    const { id } = params;
    // حذف المنتج
    const deletedProduct = await FutureProduct.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Product deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to delete product.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}