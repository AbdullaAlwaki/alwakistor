import { NextResponse } from "next/server";
import User from "../../../../models/User"; // ✅ استيراد نموذج المستخدم

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token")?.trim(); // ✅ إزالة المسافات الزائدة
    const email = url.searchParams.get("email")?.trim(); // ✅ إزالة المسافات الزائدة

    if (!token || !email) {
      return NextResponse.json({ error: "رابط التأكيد غير صالح" }, { status: 400 });
    }

    // البحث عن المستخدم باستخدام البريد الإلكتروني
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    // التحقق من صلاحية رمز التأكيد
    if (user.emailVerificationToken !== token) {
      return NextResponse.json({ error: "رابط التأكيد غير صالح" }, { status: 400 });
    }

    // التحقق من تاريخ إنشاء رمز التأكيد (مثلاً: يجب أن يكون الرابط صالحًا لمدة 24 ساعة)
    const tokenCreatedAt = user.emailVerificationTokenCreatedAt;
    const now = new Date();
    const timeDifference = now.getTime() - tokenCreatedAt.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 24) {
      return NextResponse.json({ error: "رابط التأكيد منتهي الصلاحية" }, { status: 400 });
    }

    // تحديث حالة البريد الإلكتروني ليكون مؤكدًا
    user.emailVerified = true;
    user.emailVerificationToken = null; // ✅ حذف رمز التأكيد بعد الاستخدام
    user.emailVerificationTokenCreatedAt = null; // ✅ حذف تاريخ الإنشاء
    await user.save();


    return NextResponse.json(
      { message: "تم تأكيد البريد الإلكتروني بنجاح." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Verify Endpoint:", error); // ✅ تسجيل الخطأ
    return NextResponse.json({ error: "حدث خطأ أثناء تأكيد البريد الإلكتروني" }, { status: 500 });
  }
}