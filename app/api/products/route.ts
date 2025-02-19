import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect(); // الاتصال بـ MongoDB

    // استخراج معلمة البحث من URL
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search") || "";

    // بناء الاستعلام للبحث باستخدام الـ regex
    const searchCriteria = searchQuery
      ? { $or: [{ name: { $regex: searchQuery, $options: "i" } }, { description: { $regex: searchQuery, $options: "i" } }] }
      : {};

    // جلب المنتجات بناءً على معلمة البحث
    const products = await Product.find(searchCriteria);

    return Response.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
