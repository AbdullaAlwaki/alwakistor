import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // أو أي خدمة بريد أخرى
  auth: {
    user: process.env.EMAIL, // عنوان البريد الإلكتروني الخاص بك
    pass: process.env.PASSWORD_NODEMAILER, // كلمة المرور الخاصة بك
  },
});

// 🟢 جلب جميع المستخدمين
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("-password"); // ❗️ عدم إرجاع كلمة المرور
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

// 🟢 إضافة مستخدم جديد
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log(body);

    const { name, email, role } = body;

    // ❗️ التحقق من صحة البيانات الواردة
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required." },
        { status: 400 }
      );
    }

    // ❗️ التحقق من فريديّة البريد الإلكتروني
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists." },
        { status: 409 }
      );
    }

    // إنشاء رمز إعادة تعيين كلمة المرور
    const resetPasswordToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const resetPasswordExpires = Date.now() + 3600000; // صالح لمدة ساعة

    // إنشاء المستخدم بدون كلمة مرور
    const user = await User.create({
      name,
      email,
      password: resetPasswordExpires, // لا نقوم بتعيين كلمة مرور هنا
      role,
      resetPasswordToken,
      resetPasswordExpires,
    });

    // إنشاء رابط إعادة تعيين كلمة المرور
    const resetPasswordUrl = `${process.env.BASE_URL}/reset-password?token=${resetPasswordToken}`;

    // إرسال البريد الإلكتروني
    const mailOptions = {
      from: "Alwaki"+process.env.EMAIL,
      to: email,
      subject: "أكمل تسجيلك وتعيين كلمة المرور",
      text: `مرحبًا ${name}،\n\nيرجى النقر على الرابط أدناه لإكمال تسجيلك وتعيين كلمة المرور الخاصة بك:\n\n${resetPasswordUrl}\n\nشكرًا لك!`,
      html: `<p>مرحبًا ${name}،</p><p>يرجى النقر على الرابط أدناه لإكمال تسجيلك وتعيين كلمة المرور الخاصة بك:</p><p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p><p>شكرًا لك!</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        data: {
          message: "تم إرسال بريد إلكتروني لإكمال التسجيل.",
          userId: user._id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

// 🟢 تعديل مستخدم موجود
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, name, email, role } = body;

    // ❗️ التحقق من صحة ID
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID." },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

// 🟢 حذف مستخدم
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    console.log(request);

    const body = await request.json();
    const { id } = body;

    // ❗️ التحقق من صحة ID
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID." },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
