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
        hostname: process.env.NEXT_PUBLIC_WP_HOSTNAME,
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
      // デフォルト投稿
      {
        source: "/",
        destination: "/posts/params/page/1",
      },
      {
        source: "/page/:page",
        destination: "/posts/params/page/:page",
      },
      {
        source: "/category/:category",
        destination: "/posts/params/category/:category/page/1",
      },
      {
        source: "/posts/category/:category",
        destination: "/posts/params/category/:category/page/1",
      },
      {
        source: "/category/:category/page/:page",
        destination: "/posts/params/category/:category/page/:page",
      },
      {
        source: "/posts/category/:category/page/:page",
        destination: "/posts/params/category/:category/page/:page",
      },
      {
        source: "/posts/page/:page",
        destination: "/posts/params/page/:page",
      },
      {
        source: "/posts",
        destination: "/posts/params/page/1",
      },
      // カスタム投稿タイプ code
      {
        source: "/codes",
        destination: "/codes/params/page/1",
      },
      {
        source: "/codes/page/:page",
        destination: "/codes/params/page/:page",
      },
      {
        source: "/codes/category/:category",
        destination: "/codes/params/category/:category/page/1",
      },
      {
        source: "/codes/category/:category/page/:page",
        destination: "/codes/params/category/:category/page/:page",
      },
      // カスタム投稿タイプ manual
      {
        source: "/manuals",
        destination: "/manuals/params/page/1",
      },
      {
        source: "/manuals/page/:page",
        destination: "/manuals/params/page/:page",
      },
      {
        source: "/manuals/category/:category",
        destination: "/manuals/params/category/:category/page/1",
      },
      {
        source: "/manuals/category/:category/page/:page",
        destination: "/manuals/params/category/:category/page/:page",
      },
    ];
  },
};

export default nextConfig;
