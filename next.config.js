/** @type {import('next').NextConfig} */

const WebpackPluginReplaceNpm = require('replace-module-webpack-plugin')

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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        os: false,
        path: false,
        module: false
      }
      config.plugins = [
        ...config.plugins,
        new WebpackPluginReplaceNpm({
          rules: [
            {
              originModule: "bsv-wasm",
              replaceModule: "bsv-wasm-web",
            },
          ],
        })
      ]
    }
    return config;
  }
}

module.exports = nextConfig
