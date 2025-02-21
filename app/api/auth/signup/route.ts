import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb"; // ✅ استيراد الاتصال بقاعدة البيانات
import User from "../../../../models/User"; // ✅ استيراد نموذج المستخدم

// إعداد خدمة إرسال البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    await dbConnect(); // ✅ التأكد من الاتصال بقاعدة البيانات
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "يرجى إدخال جميع البيانات" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "هذا البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
    }

    
    // إنشاء رمز التأكيد
    const verificationToken = Math.random().toString(36).substring(2, 15);

    // إنشاء المستخدم الجديد
    const newUser = new User({
      name,
      email,
      password: password,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenCreatedAt: new Date(),
    });

    await newUser.save();

    // إنشاء رابط التأكيد
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationLink = `${baseUrl}/ar/verify-email?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;

    // إرسال البريد الإلكتروني
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `مرحبًا ${name}، يرجى تأكيد بريدك الإلكتروني`,
      html: `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد البريد الإلكتروني</title>
          <style>
            /* Client-specific Styles */
            body {
              margin: 0;
              padding: 0;
              background-color: #111827; /* خلفية داكنة */
              font-family: 'Cairo', Arial, sans-serif;
              color: #FFFFFF; /* نص أبيض */
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            td, th {
              padding: 0;
            }
            a {
              text-decoration: none;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #111827;">
          <!-- Main Wrapper -->
          <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; margin: 0 auto; background-color: #1F2937; /* خلفية الجدول */ border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); border: 1px solid #374151;" role="presentation">
            <!-- Header Section -->
            <tr>
              <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); text-align: center; padding: 1.5rem;">
                <img src="https://cdn.qwenlm.ai/output/e54871a8-b030-4f12-a895-c8d7c978d24d/t2i/30a8c698-9735-4199-b1bb-72c20b300490/36900098-a1b1-4e4e-9b55-79265e65a87b.png" alt="شعار المتجر" style="height: 48px;">
              </td>
            </tr>
            <!-- Content Section -->
            <tr>
              <td style="padding: 2.5rem; color: #FFFFFF; line-height: 1.8; font-size: 16px; text-align: center;">
                <p style="margin-bottom: 1.5rem;">مرحبًا <strong>${name}</strong>،</p>
                <p style="margin-bottom: 1.5rem;">نشكرك على الانضمام إلى مجتمعنا! يرجى تأكيد عنوان بريدك الإلكتروني للحصول على تجربة تسوق مكتملة.</p>
                
                <!-- Verify Button -->
                <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: #FFFFFF; padding: 1rem 2.5rem; font-size: 18px; font-weight: 600; text-decoration: none; border-radius: 8px; margin: 2rem 0; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);">
                  تأكيد البريد الإلكتروني
                </a>
                
                <p style="color: #D1D5DB; font-size: 14px; margin-top: 1.5rem;">
                  إذا واجهت أي مشكلة في الزر أعلاه، يمكنك نسخ الرابط التالي ولصقه في متصفحك:<br>
                  <span style="word-break: break-all; color: #3B82F6;">${verificationLink}</span>
                </p>
                <p style="margin-top: 1.5rem; color: #D1D5DB;">سيضمن هذا التأكيد حماية حسابك واستلام جميع التحديثات المهمة.</p>
              </td>
            </tr>
            <!-- Footer Section -->
            <tr>
              <td style="background: #111827; padding: 1.5rem; text-align: center; font-size: 14px; color: #D1D5DB; border-top: 1px solid #374151;">
                <p style="margin-bottom: 1rem;">© ${new Date().getFullYear()} Alwaki Store. جميع الحقوق محفوظة</p>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                  <a href="#" style="color: #3B82F6; text-decoration: none; display: flex; align-items: center; justify-content: center;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991112.png" alt="شروط" style="width: 16px; height: 16px; margin-left: 0.5rem;">
                    الشروط والأحكام
                  </a>
                  <a href="#" style="color: #3B82F6; text-decoration: none; display: flex; align-items: center; justify-content: center;">
                    <img src="https://cdn-icons-png.flaticon.com/512/1182/1182977.png" alt="سياسة الخصوصية" style="width: 16px; height: 16px; margin-left: 0.5rem;">
                    سياسة الخصوصية
                  </a>
                  <a href="mailto:ِAbdullaalwaki@icloud.com" style="color: #3B82F6; text-decoration: none; display: flex; align-items: center; justify-content: center;">
                    <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="الدعم الفني" style="width: 16px; height: 16px; margin-left: 0.5rem;">
                    الدعم الفني
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح. يرجى تأكيد بريدك الإلكتروني." }, { status: 201 });
  } catch (error) {
    console.error("❌ خطأ في نقطة النهاية الخاصة بالتسجيل:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 });
  }
}