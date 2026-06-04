/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  async headers() {
    return [
      {
        // Never cache HTML pages so browsers always get fresh chunk references after a redeploy
        source: '/((?!_next|favicon|robots|sitemap).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
