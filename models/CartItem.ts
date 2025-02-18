import mongoose, { Schema, Document, Types } from 'mongoose';
import Product from './Product';

export interface ICartItem extends Document {
  quantity: number;
  productId: Types.ObjectId;
}

const cartItemSchema = new Schema<ICartItem>({
  quantity: { type: Number, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

const CartItem = mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', cartItemSchema);

export default CartItem;