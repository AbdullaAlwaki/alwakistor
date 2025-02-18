/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // تمكين وضع التصحيح الصارم
  images: {
    domains: ["pattersonpope.com"], // ✅ إضافة اسم النطاق هنا
  },
};

module.exports = nextConfig; // ✅ استخدام module.exports بدلاً من export default
