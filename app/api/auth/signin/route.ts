import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // التحقق من وجود البيانات
    if (!email || !password) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }, { status: 400 });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // التحقق من أن البريد الإلكتروني مؤكد
    if (!user.emailVerified) {
      return NextResponse.json({ error: 'يرجى تأكيد بريدك الإلكتروني أولاً' }, { status: 403 });
    }

    // التحقق من صحة كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // تسجيل الدخول ناجح
    return NextResponse.json(
      { message: 'تم تسجيل الدخول بنجاح', user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الدخول' }, { status: 500 });
  }
}