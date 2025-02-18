import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 حذف البيانات القديمة...");
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();

  console.log("✅ إدخال المنتجات الجديدة...");
  const product1 = await prisma.product.create({
    data: {
      name: 'منتج 1',
      description: 'وصف المنتج الأول',
      price: 100,
      imageUrl: 'https://example.com/product1.jpg',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'منتج 2',
      description: 'وصف المنتج الثاني',
      price: 200,
      imageUrl: 'https://example.com/product2.jpg',
    },
  });

  console.log("🛒 إضافة العناصر إلى سلة التسوق...");
  await prisma.cartItem.create({
    data: {
      product: { connect: { id: product1.id } }, // ربط المنتج بالسلة
      quantity: 2,
    },
  });

  await prisma.cartItem.create({
    data: {
      product: { connect: { id: product2.id } }, // ربط المنتج بالسلة
      quantity: 1,
    },
  });

  console.log('🎉 تمت إضافة البيانات بنجاح!');
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء تنفيذ `seed.ts`:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
