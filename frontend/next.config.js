/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.glsl/,
      type: "asset/source",
      // use: ["raw-loader", "glslify-loader"],
    });
    return config;
  },
};

module.exports = nextConfig;
