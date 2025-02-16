import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client/edge";


const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { orderId, status } = await request.json();

    // التحقق من وجود بيانات
    if (!orderId || !status) {
      return NextResponse.json({ error: 'رقم الطلب والحالة مطلوبان.' }, { status: 400 });
    }

    // تحديث حالة الطلب في قاعدة البيانات
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح.' });
  } catch (error) {
    console.error('حدث خطأ أثناء تحديث حالة الطلب:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث حالة الطلب.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}