/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // تمكين وضع التصحيح الصارم
  images: {
    unoptimized: true, // تعطيل قيود Next.js على الصور
  },
};

module.exports = nextConfig; // ✅ استخدام module.exports بدلاً من export default
