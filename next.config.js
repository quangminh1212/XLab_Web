/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    FIGMA_PUBLIC_KEY: process.env.FIGMA_PUBLIC_KEY,
  },
}

module.exports = nextConfig 