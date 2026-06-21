/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Local network IP theke access korte allow kora (e.g. mobile/other device e test)
  allowedDevOrigins: [
    "192.168.0.79",
    "192.168.1.79",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
