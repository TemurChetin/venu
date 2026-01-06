import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "venu.uz",
        pathname: "/storage/**", // This ensures any path under /storage is allowed
      },
      {
        protocol: "https",
        hostname: "api.venu.uz",
        pathname: "/storage/**", // This ensures any path under /storage is allowed
      },
      {
        protocol: "https",
        hostname: "venu.jscorp.uz",
        pathname: "/**", // This ensures any path under /storage is allowed
      },
      {
        protocol: "https",
        hostname: "media.moddb.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
