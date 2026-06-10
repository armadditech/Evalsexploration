/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // Monaco Editor requires special handling for webpack
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    return config;
  },
  // Ensure Monaco Editor workers are properly loaded
  transpilePackages: ['monaco-editor'],
};

export default nextConfig;
