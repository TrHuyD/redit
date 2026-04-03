/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com','cdn.discordapp.com','utfs.io','i.redd.it','styles.redditmedia.com','redditstatic.com','www.redditstatic.com'],
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
