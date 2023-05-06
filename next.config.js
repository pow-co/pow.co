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
  webpack5: true,
  webpack: (config) => {

    config.resolve.fallback = {
      console: false,
      fs: false,
      path: false
    }

    return config

  }
}

module.exports = nextConfig
