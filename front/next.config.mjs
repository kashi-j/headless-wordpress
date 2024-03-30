/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/post/params/page/1",
      },
      {
        source: "/page/:page",
        destination: "/post/params/page/:page",
      },
      {
        source: "/category/:category",
        destination: "/post/params/category/:category/page/1",
      },
      {
        source: "/category/:category/page/:page",
        destination: "/post/params/category/:category/page/:page",
      },
    ];
  },
};

export default nextConfig;
