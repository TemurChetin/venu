import type { Metadata } from "next";
import { generateSearchMetadata } from "@/lib/seo";

/**
 * Layout for search page
 * Handles metadata generation (server component)
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ query?: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // Safely handle searchParams
  let decodedQuery: string | undefined;
  if (searchParams) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams?.query;

    // Decode base64 query if present (server-side compatible)
    if (query) {
      try {
        // Use Buffer for server-side base64 decoding
        const decoded = Buffer.from(query, "base64").toString("utf-8");
        decodedQuery = decodeURIComponent(decoded);
      } catch {
        // If decoding fails, use original query
        decodedQuery = query;
      }
    }
  }

  return generateSearchMetadata(decodedQuery, lang);
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
