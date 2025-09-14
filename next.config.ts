import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'localhost',
                port: '7283',
                pathname: '/api/events/**/image',
            },
        ],
    },

};

export default nextConfig;
