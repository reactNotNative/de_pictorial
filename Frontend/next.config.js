module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        // crypto: require.resolve("crypto-browserify"),
      };
    }
    return config;
  },
}
