import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import FutureProduct from '../../../../../models/FutureProduct';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect(); // الاتصال بقاعدة البيانات

    // انتظار params لأنه أصبح Promise في Next.js 15
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid product ID.' }, { status: 400 });
    }

    // استخراج البيانات من الطلب
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
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
