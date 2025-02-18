import dbConnect from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// حذف منتج
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB

    const { id } = params;

    // التحقق من وجود المنتج
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    // حذف المنتج
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);

    // التحقق من نوع الخطأ وإرجاع رسالة مناسبة
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to delete product.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}