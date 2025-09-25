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
        // Konfigurasi baru ditambahkan di sini
        protocol: 'https',
        hostname: 'www.megasyariah.co.id',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;