import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // إضافة منتجات اختبارية
  await prisma.product.createMany({
    data: [
      {
        name: 'منتج 1',
        description: 'وصف المنتج الأول',
        price: 100,
        imageUrl: 'https://mediaphic.com/wp-content/uploads/2021/02/%D9%86%D9%85%D9%88%D8%B0%D8%AC-%D8%B5%D9%88%D8%B1%D8%A9-%D9%85%D9%86%D8%AA%D8%AC-6-768x607.jpg',
      },
      {
        name: 'منتج 2',
        description: 'وصف المنتج الثاني',
        price: 200,
        imageUrl: 'https://th.bing.com/th/id/OIP.GkWr18rM-uJmEbf1wfi9ggHaE8?rs=1&pid=ImgDetMain',
      },
      {
        name: 'منتج 3',
        description: 'وصف المنتج الثالث',
        price: 300,
        imageUrl: 'https://png.pngtree.com/background/20230414/original/pngtree-lipstick-lipstick-cosmetics-makeup-photography-advertising-background-picture-image_2424151.jpg',
      },
    ],
  });
}

main()
  .then(() => console.log('تمت إضافة المنتجات بنجاح'))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });