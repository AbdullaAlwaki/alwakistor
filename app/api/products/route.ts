import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // جلب جميع المنتجات من قاعدة البيانات
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }, // ترتيب المنتجات حسب معرف المنتج (الأحدث أولاً)
    });

    // التحقق مما إذا كانت المنتجات موجودة
    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'لا توجد منتجات متاحة.' },
        { status: 404 }
      );
    }

    // إرجاع قائمة المنتجات
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);

    // التحقق من نوع الخطأ
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message || 'حدث خطأ أثناء جلب المنتجات.' },
        { status: 500 }
      );
    }

    // في حالة حدوث خطأ غير متوقع
    return NextResponse.json(
      { success: false, message: 'حدث خطأ غير متوقع.' },
      { status: 500 }
    );
  }
}