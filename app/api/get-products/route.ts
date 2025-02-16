import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // جلب جميع المنتجات من قاعدة البيانات
    const products = await prisma.product.findMany();

    // التحقق من أن البيانات ليست فارغة
    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'لا توجد منتجات متاحة.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('حدث خطأ أثناء جلب المنتجات:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب المنتجات.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}