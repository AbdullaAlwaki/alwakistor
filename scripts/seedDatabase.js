import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // إضافة منتج جديد
    const product = await prisma.product.create({
      data: {
        name: "منتج تجريبي",
        price: 100,
        description: "وصف المنتج التجريبي",
      },
    });

    console.log("تم إضافة المنتج:", product);

    // إضافة عنصر سلة جديد
    const cartItem = await prisma.cartItem.create({
      data: {
        quantity: 2,
        productId: product.id, // استخدام معرف المنتج الذي تم إضافته
      },
    });

    console.log("تم إضافة عنصر السلة:", cartItem);
  } catch (error) {
    console.error("حدث خطأ أثناء ملء قاعدة البيانات:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();