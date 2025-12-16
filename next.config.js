/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbopack: {
            root: process.cwd(),
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'cloud.appwrite.io',
            },
            {
                protocol: 'https',
                hostname: 'tor.cloud.appwrite.io',
            },
            {
                protocol: 'https',
                hostname: '*.appwrite.io',
            },
        ],
    },
}

export default nextConfig
