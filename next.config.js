/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['figma.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.figma.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@/components/generated'],
  },
}

export default nextConfig 