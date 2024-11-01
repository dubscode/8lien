/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      },
      {
        protocol: 'https',
        hostname: 'merry-kiwi-926.convex.cloud'
      },
      {
        protocol: 'https',
        hostname: '*blob.vercel-storage.com'
      }
    ]
  }
};

module.exports = nextConfig;
