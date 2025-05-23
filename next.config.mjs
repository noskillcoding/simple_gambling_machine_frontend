/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add these lines:
    output: 'export',
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;