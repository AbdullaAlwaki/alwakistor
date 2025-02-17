import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerificationToken !== token) {
      return NextResponse.json({ success: false, message: 'رابط التأكيد غير صالح.' }, { status: 400 });
    }

    // تحديث حالة التحقق من البريد الإلكتروني
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        emailVerificationToken: null, // ✅ حذف رمز التحقق بعد التأكيد
      },
    });

    return NextResponse.json({ success: true, message: 'تم تأكيد البريد الإلكتروني بنجاح.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء تأكيد البريد الإلكتروني.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}