/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.tokopedia.net',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.megasyariah.co.id',
        port: '',
        pathname: '**',
      },
      // Konfigurasi untuk Google Drive
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '**',
      },
       {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '**',
      }
    ],
  },
};

export default nextConfig;