import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/portfolio", destination: "/projects", permanent: true },
      { source: "/builder", destination: "/", permanent: true },
      { source: "/contact", destination: "/about", permanent: true },
      { source: "/parkrun", destination: "/projects/park-run-dash", permanent: true },
      {
        source: "/holiday-agent/:path*",
        destination: "/projects/holiday-concierge",
        permanent: true,
      },
      // Media guide migrated to the standalone Runway app
      {
        source: "/media-guide",
        destination: "https://runway.1zero9.com/",
        permanent: true,
      },
      {
        source: "/media-guide/:path*",
        destination: "https://runway.1zero9.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.public.blob.vercel-storage.com",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withContentCollections(nextConfig);
