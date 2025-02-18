/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // تمكين وضع التصحيح الصارم
  i18n: {
    locales: ['en', 'ar'], // اللغات المدعومة
    defaultLocale: 'en', // اللغة الافتراضية
  },
};

module.exports = nextConfig; // ✅ استخدام module.exports بدلاً من export default
