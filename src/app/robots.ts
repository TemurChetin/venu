import { MetadataRoute } from "next";

/**
 * Generate robots.txt for SEO
 * Controls search engine crawler access to the site
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venu.uz";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // Block API routes
          "/auth/", // Block auth pages from indexing
          "/checkout/", // Block checkout pages
          "/orders/", // Block user orders pages
          "/settings/", // Block settings pages
          "/_next/", // Block Next.js internal files
          "/admin/", // Block admin pages if any
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/checkout/",
          "/orders/",
          "/settings/",
          "/_next/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/checkout/",
          "/orders/",
          "/settings/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

