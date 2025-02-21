import dbConnect from "../../../lib/mongodb";
import FutureProduct from "../../../models/FutureProduct";

export async function GET(request: Request) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB

    // استخراج معلمات البحث من URL
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search") || "";
    const productId = url.searchParams.get("id") || "";

    if (productId) {
      // إذا تم توفير معرف المنتج، جلب المنتج المحدد
      const product = await FutureProduct.findById(productId);
      if (!product) {
        return new Response(
          JSON.stringify({ success: false, message: "Product not found." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ success: true, data: product }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // إذا لم يتم توفير معرف، جلب المنتجات بناءً على معلمة البحث
    const searchCriteria = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    const products = await FutureProduct.find(searchCriteria);
    return new Response(
      JSON.stringify({ success: true, data: products }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch products." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
