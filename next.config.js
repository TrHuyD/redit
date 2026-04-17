/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "*.utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.redd.it",
      },
      {
        protocol: "https",
        hostname: "*.redditmedia.com",
      },
      {
        protocol: "https",
        hostname: "*.redditstatic.com",
      },
      {
        protocol: "https",
        hostname: "redditinc.com",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;