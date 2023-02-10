/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/sms/json",
        destination: "/api/sms",
      },
      {
        source: "/_/health",
        destination: "/api/health",
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig
