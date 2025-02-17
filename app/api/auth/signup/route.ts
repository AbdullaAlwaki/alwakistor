import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// إعداد خدمة إرسال البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: 'Gmail', // أو أي خدمة بريد أخرى
  auth: {
    user: process.env.EMAIL_USER, // عنوان البريد الإلكتروني الخاص بك
    pass: process.env.EMAIL_PASS, // كلمة المرور الخاصة بك
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // التحقق من وجود البيانات
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'يرجى إدخال جميع البيانات' }, { status: 400 });
    }

    // التحقق من وجود المستخدم في قاعدة البيانات
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مستخدم بالفعل' }, { status: 400 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء رمز التحقق
    const verificationToken = Math.random().toString(36).substring(2, 15); // رمز عشوائي

    // إنشاء المستخدم الجديد مع رمز التحقق
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false, // البدء بحالة غير مؤكدة
        emailVerificationToken: verificationToken, // ✅ إضافة رمز التحقق
      },
    });

    // إنشاء رابط التأكيد
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}&email=${email}`;

    // إرسال البريد الإلكتروني
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'تأكيد البريد الإلكتروني',
      text: `مرحبًا ${name}،\n\nيرجى تأكيد بريدك الإلكتروني بالنقر على الرابط التالي:\n${verificationLink}`,
      html: `<p>مرحبًا ${name}،</p><p>يرجى تأكيد بريدك الإلكتروني بالنقر على الرابط التالي:</p><a href="${verificationLink}">${verificationLink}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'تم إنشاء الحساب بنجاح. يرجى تأكيد بريدك الإلكتروني.' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحساب' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}