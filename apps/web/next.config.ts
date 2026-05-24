const project = process.env.PORTLESS_PROJECT ?? 'viteplusmono'
const tld = process.env.PORTLESS_TLD ?? 'test'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [`web.${project}.${tld}`],
  // Force all @tanstack/react-query imports to resolve to web's copy,
  // preventing the dual-instance issue in the pnpm monorepo.
  turbopack: {
    resolveAlias: {
      '@tanstack/react-query': './node_modules/@tanstack/react-query',
    },
  },
}

export default nextConfig
