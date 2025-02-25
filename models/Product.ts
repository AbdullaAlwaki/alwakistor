import mongoose, { Schema, Document } from "mongoose";

// واجهة TypeScript لتحديد بنية المنتج
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// تعريف مخطط المنتج
const ProductSchema: Schema = new Schema(
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
  },
  {
    timestamps: true, // ✅ إضافة خاصية الوقت (createdAt, updatedAt)
  }
);

// تصدير النموذج
const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;