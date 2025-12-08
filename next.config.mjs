/** @type {import('next').NextConfig} */
const nextConfig = {
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
    turbopack: {
      resolveAlias: {
        'lightningcss': false,
      },
    },
  }
}

export default nextConfig;
