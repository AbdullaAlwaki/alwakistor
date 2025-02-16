import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // استخراج بيانات الطلب (مثل productId)
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'معرف المنتج مطلوب.' },
        { status: 400 }
      );
    }

    // التحقق من وجود المنتج
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود.' },
        { status: 404 }
      );
    }

    // إضافة العنصر إلى السلة
    const cartItem = await prisma.cartItem.create({
      data: {
        quantity,
        productId,
      },
    });

    return NextResponse.json({ success: true, cartItem });
  } catch (error) {
    console.error('حدث خطأ أثناء إضافة العنصر إلى السلة:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إضافة العنصر إلى السلة.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}