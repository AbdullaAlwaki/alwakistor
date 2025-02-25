import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    await dbConnect();

    // البحث عن المنتجات الحالية التي تحتوي على النص المدخل
    const products = await Product.find(
      { name: { $regex: query, $options: "i" } },
      { name: 1 }
    ).limit(5);
    // دمج الاقتراحات من كلا المصدرَين
    const suggestions = products.map((product) => product.name).slice(0, 5); // ✅ تحديد العدد الإجمالي للاقتراحات

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}