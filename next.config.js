/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
