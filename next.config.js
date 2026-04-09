/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '.',
  },
  transpilePackages: ['@clerk/nextjs'],
};

module.exports = nextConfig;
