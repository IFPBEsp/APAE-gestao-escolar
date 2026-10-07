/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/gestao-escolar',
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:8080'}/gestao-escolar/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
