import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client/edge";


const prisma = new PrismaClient();

export async function GET() {
  try {
    // جلب جميع الطلبات
    const orders = await prisma.order.findMany();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('حدث خطأ أثناء جلب الطلبات:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الطلبات.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}