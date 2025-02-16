import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
  }

  // التحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'هذا البريد الإلكتروني مستخدم بالفعل' }, { status: 400 });
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  // إنشاء المستخدم الجديد
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: 'تم تسجيل المستخدم بنجاح', user });
}