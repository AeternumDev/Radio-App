/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  transpilePackages: [
    '@ionic/react',
    '@ionic/core',
    '@stencil/core',
    'ionicons',
  ],
};

module.exports = nextConfig;
