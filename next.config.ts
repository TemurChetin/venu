import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "venu.uz",
        pathname: "/storage/**", // This ensures any path under /storage is allowed
      },
      {
        protocol: "https",
        hostname: "media.moddb.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
