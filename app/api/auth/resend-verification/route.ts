import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// إعداد خدمة إرسال البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'البريد الإلكتروني مؤكد بالفعل' }, { status: 400 });
    }

    // إنشاء رمز تأكيد جديد
    const verificationToken = Math.random().toString(36).substring(2, 15);

    // تحديث بيانات المستخدم
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenCreatedAt: new Date(),
      },
    });

    // إنشاء رابط التأكيد
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;

    // إرسال البريد الإلكتروني
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'تأكيد البريد الإلكتروني',
      text: `مرحبًا ${user.name}،\n\nيرجى تأكيد بريدك الإلكتروني بالنقر على الرابط التالي:\n${verificationLink}`,
      html: `<p>مرحبًا ${user.name}،</p><p>يرجى تأكيد بريدك الإلكتروني بالنقر على الرابط التالي:</p><a href="${verificationLink}">${verificationLink}</a>`,
    };
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'تم إعادة إرسال رابط التأكيد بنجاح.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إعادة إرسال رابط التأكيد.' }, { status: 500 });
  }
}