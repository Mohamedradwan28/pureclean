import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // السماح بالوصول من عناوين الشبكة المحلية أثناء التطوير
  allowedDevOrigins: ['192.168.1.3', 'localhost', '127.0.0.1'],
  
  // تحسينات الصور
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  
  // إعدادات TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;