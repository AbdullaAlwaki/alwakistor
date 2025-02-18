import dbConnect from "../../../lib/mongodb";
import FutureProduct from "../../../models/FutureProduct";

export async function GET() {
  try {
    await dbConnect(); // الاتصال بـ MongoDB

    // جلب المنتجات المستقبلية
    const futureProducts = await FutureProduct.find();

    return Response.json({ success: true, data: futureProducts });
  } catch (error) {
    console.error("Error fetching future products:", error);
    return Response.json(
      { success: false, message: "Failed to fetch future products." },
      { status: 500 }
    );
  }
}