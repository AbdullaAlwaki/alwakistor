import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// واجهة TypeScript لتحديد بنية المستخدم
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  emailVerified: boolean; // ✅ حقل للتحقق من البريد الإلكتروني
  emailVerificationToken?: string; // ✅ رمز التأكيد (اختياري)
  emailVerificationTokenCreatedAt?: Date; // ✅ تاريخ إنشاء رمز التأكيد (اختياري)
}

// تعريف مخطط المستخدم
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false, // ✅ القيمة الافتراضية هي `false`
    },
    emailVerificationToken: {
      type: String,
      default: null, // ✅ قيمة افتراضية
    },
    emailVerificationTokenCreatedAt: {
      type: Date,
      default: null, // ✅ قيمة افتراضية
    },
  },
  {
    timestamps: true, // ✅ إضافة خاصية الوقت (createdAt, updatedAt)
  }
);

// قبل حفظ المستخدم، قم بتشفير كلمة المرور
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// طريقة لتوفير التحقق من كلمة المرور
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// تصدير النموذج
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;