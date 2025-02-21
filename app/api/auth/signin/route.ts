import User from "../../../../models/User"; // ✅ استيراد نموذج المستخدم
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb"; // ✅ استيراد وظيفة الاتصال بقاعدة البيانات

export async function POST(request: Request) {
  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();

    // استخراج البريد الإلكتروني وكلمة المرور من الطلب
    const { email, password } = await request.json();

    // التحقق من وجود البيانات
    if (!email || !password) {
      return NextResponse.json(
        { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 }
      );
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود", redirect: "/signup" }, // ✅ إضافة توجيه إلى صفحة التسجيل
        { status: 404 }
      );
    }

    // التحقق من أن البريد الإلكتروني مؤكد
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "يرجى تأكيد بريدك الإلكتروني أولاً" },
        { status: 403 }
      );
    }
    console.log(password, user.password);
    

    // التحقق من صحة كلمة المرور
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password); // ✅ إزالة المسافات البيضاء
    if (!isPasswordValid) {
      console.error("Password comparison failed:", { entered: password, stored: user.password });
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // تسجيل الدخول ناجح
    return NextResponse.json(
      {
        message: "تم تسجيل الدخول بنجاح",
        user: {
          id: user._id.toString(), // ✅ تحويل ObjectId إلى سلسلة نصية
          name: user.name,
          email: user.email,
          role: user.role, // ✅ إضافة دور المستخدم (إذا كان لديك حقل `role`)
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ خطأ أثناء تسجيل الدخول:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}