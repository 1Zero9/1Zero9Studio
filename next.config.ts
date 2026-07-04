import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/portfolio", destination: "/projects", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/builder", destination: "/", permanent: true },
      { source: "/contact", destination: "/about", permanent: true },
      { source: "/parkrun", destination: "/projects/park-run-dash", permanent: true },
      {
        source: "/holiday-agent/:path*",
        destination: "/projects/holiday-concierge",
        permanent: true,
      },
    ];
  },
};

export default withContentCollections(nextConfig);
