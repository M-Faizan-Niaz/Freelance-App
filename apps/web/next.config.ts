const project = process.env.PORTLESS_PROJECT ?? 'viteplusmono';
const tld = process.env.PORTLESS_TLD ?? 'test';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [`web.${project}.${tld}`],
};

export default nextConfig;
