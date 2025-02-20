import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB

    // استخراج معلمات البحث من URL
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search") || "";
    const productId = url.searchParams.get("id") || "";

    let products;

    if (productId) {
      // إذا تم توفير معرف المنتج، جلب المنتج المحدد
      const product = await Product.findById(productId);

      if (!product) {
        return Response.json(
          { success: false, message: "Product not found." },
          { status: 404 }
        );
      }

      return Response.json({ success: true, data: product });
    } else {
      // إذا لم يتم توفير معرف، جلب المنتجات بناءً على معلمة البحث
      const searchCriteria = searchQuery
        ? {
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { description: { $regex: searchQuery, $options: "i" } },
            ],
          }
        : {};

      products = await Product.find(searchCriteria);
      return Response.json({ success: true, data: products });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}