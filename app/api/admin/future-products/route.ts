import dbConnect from '../../../../lib/mongodb';
import FutureProduct from '../../../../models/FutureProduct';
import { NextRequest, NextResponse } from 'next/server';

// جلب جميع المنتجات
export async function GET() {
  try {
    await dbConnect();
    const products = await FutureProduct.find();
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
  }
}

// إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, message: 'Name and price are required.' }, { status: 400 });
    }

    const product = await FutureProduct.create({ name, description, price, imageUrl });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
  }
}

// تعديل منتج موجود
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid product ID.' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    const updatedProduct = await FutureProduct.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl },
      { new: true }
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

// حذف منتج
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid product ID.' }, { status: 400 });
    }

    const deletedProduct = await FutureProduct.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
  }
}
