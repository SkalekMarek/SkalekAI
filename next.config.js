/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This forces Vercel to ignore linting errors during the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This forces Vercel to ignore TypeScript errors during the build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;