import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET() {
  try {
    await dbConnect(); // الاتصال بـ MongoDB
    const products = await Product.find(); // جلب جميع المنتجات
    return Response.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ success: false, message: 'Failed to fetch products.' }, { status: 500 });
  }
}