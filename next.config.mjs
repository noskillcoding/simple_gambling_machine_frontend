/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    // Add this line:
    assetPrefix: './', // This tells Next.js to use relative paths for assets
  };
  
  export default nextConfig;