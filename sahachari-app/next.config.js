/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['supports-color'],
  },
  transpilePackages: ['supports-color'],
}

module.exports = nextConfig 