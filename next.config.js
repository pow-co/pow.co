/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'berry.relayx.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
