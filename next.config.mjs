/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
         {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ]
  },
  experimental: {
    optimizeCss: false,
  }
}

export default nextConfig
