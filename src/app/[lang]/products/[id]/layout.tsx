import type { Metadata } from "next";
import { generateProductMetadata } from "@/lib/seo";
import { fetchProductDetail } from "@/lib/api-server";

/**
 * Layout for product detail page
 * Handles metadata generation (server component)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const product = await fetchProductDetail(id, lang);

  if (!product) {
    return generateProductMetadata(
      {
        name: "Mahsulot topilmadi",
        slug: id,
        unit_price: 0,
      },
      lang
    );
  }

  return generateProductMetadata(product, lang);
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
