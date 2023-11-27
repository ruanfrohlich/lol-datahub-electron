/**
 * @type {import('next').NextConfig}
 */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  output: 'export',
  compiler: {
    removeConsole: !isDev,
  },
};

module.exports = nextConfig;
