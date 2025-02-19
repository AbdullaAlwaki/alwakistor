import dbConnect from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';
import { NextRequest, NextResponse } from 'next/server';

// 🟢 تعديل منتج موجود
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params; // 🛠 إصلاح استخراج ID

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid product ID.' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    const updatedProduct = await Product.findByIdAndUpdate(
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
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
  }
}
