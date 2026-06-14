/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/old/:path((?!assets/|.*\\..*).*)?',
        destination: '/old/index.html',
      },
    ];
  },
};

export default nextConfig;
