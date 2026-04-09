/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: '.',
    },
  },
  transpilePackages: ['@clerk/nextjs'],
};

module.exports = nextConfig;
