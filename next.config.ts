/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // تمكين وضع التصحيح الصارم
  swcMinify: true,       // تمكين تقليل الحجم باستخدام SWC
};

module.exports = nextConfig; // ✅ استخدام module.exports بدلاً من export default
