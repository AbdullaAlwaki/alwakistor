import mongoose, { Schema, Document } from "mongoose";

// واجهة TypeScript لتحديد بنية المنتج المستقبلي
export interface IFutureProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  releaseDate: Date; // ✅ تاريخ الإصدار
}

// تعريف مخطط المنتج المستقبلي
const FutureProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // ✅ إضافة خاصية الوقت (createdAt, updatedAt)
  }
);

// تصدير النموذج
const FutureProduct = mongoose.models.FutureProduct || mongoose.model<IFutureProduct>("FutureProduct", FutureProductSchema);
export default FutureProduct;