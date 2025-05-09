import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8080', // adjust if needed
        pathname: '/uploads/apartments/**',
      },
    ],
  },
};

export default nextConfig;
