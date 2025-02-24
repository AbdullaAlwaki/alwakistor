import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { NextRequest, NextResponse } from 'next/server';

// 🟢 جلب جميع المستخدمين
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const users = await User.find().select('-password'); // ❗️ عدم إرجاع كلمة المرور
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
  }
}

// 🟢 إضافة مستخدم جديد
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password, role } = body;

    // ❗️ التحقق من صحة البيانات الواردة
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password are required.' }, { status: 400 });
    }

    // ❗️ التحقق من فريديّة البريد الإلكتروني
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already exists.' }, { status: 409 });
    }

    const user = await User.create({ name, email, password, role });
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'Invalid or missing user ID.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
  }
}

// 🟢 حذف مستخدم
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id } = body;

    // ❗️ التحقق من صحة ID
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing user ID.' }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred.' }, { status: 500 });
  }
}