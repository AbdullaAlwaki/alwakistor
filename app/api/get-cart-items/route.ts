import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // جلب عناصر السلة مع تفاصيل المنتجات المرتبطة بها
    const cartItems = await prisma.cartItem.findMany({
      include: {
        product: true, // لجلب تفاصيل المنتج المرتبط بالسلة
      },
    });

    // التحقق من أن البيانات ليست فارغة
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'لا توجد عناصر في السلة.' },
        { status: 404 }
      );
    }

    // التحقق من أن كل عنصر في السلة يحتوي على منتج مرتبط
    const validCartItems = cartItems.filter((item) => item.product);

    if (validCartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'لا توجد منتجات مرتبطة بعناصر السلة.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cartItems: validCartItems });
  } catch (error) {
    console.error('حدث خطأ أثناء جلب عناصر السلة:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب عناصر السلة.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}