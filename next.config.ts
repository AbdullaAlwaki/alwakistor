/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false, // تعطيل ESM Externals لدعم CommonJS
  },
};

export default nextConfig;