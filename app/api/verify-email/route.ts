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
      return NextResponse.json(
        { success: false, message: 'رابط التأكيد غير صالح.' },
        { status: 400 }
      );
    }

    // التحقق من انتهاء صلاحية رمز التأكيد (اختياري)
    const tokenExpiryTime = 24 * 60 * 60 * 1000; // 24 ساعة
    const isTokenExpired =
      user.emailVerificationTokenCreatedAt &&
      Date.now() - new Date(user.emailVerificationTokenCreatedAt).getTime() >
        tokenExpiryTime;

    if (isTokenExpired) {
      return NextResponse.json(
        { success: false, message: 'انتهت صلاحية رابط التأكيد.' },
        { status: 400 }
      );
    }

    // تحديث حالة التحقق من البريد الإلكتروني
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        emailVerificationToken: null, // ✅ حذف رمز التأكيد بعد التأكيد
        emailVerificationTokenCreatedAt: null, // ✅ حذف تاريخ إنشاء الرمز
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'تم تأكيد البريد الإلكتروني بنجاح.',
        redirect: '/login', // ✅ إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تأكيد البريد الإلكتروني.' },
      { status: 500 }
    );
  }
}