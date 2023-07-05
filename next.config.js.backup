/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "berry.relayx.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "berry2.relayx.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: config => {

    config.resolve.fallback = {
        fs: false,
        os: false,
        path: false,
        module: false,
        repl: false,
        console: false,
    }

    return config

  }
};

module.exports = nextConfig
