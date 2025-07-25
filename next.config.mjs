/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsHmrCache: false,
        serverActions : {
            bodySizeLimit : '20mb'
        }
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "jkhjtdwlgwghozazcykr.supabase.co",
            },
        ]
    }
};

export default nextConfig;
