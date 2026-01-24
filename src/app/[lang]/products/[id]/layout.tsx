import type { Metadata } from "next";
import { generateProductMetadata } from "@/lib/seo";
import { fetchProductDetail } from "@/lib/api-server";
import {
  StructuredData,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/components/seo/structured-data";
import { getTranslations } from "next-intl/server";

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

  const metadata = generateProductMetadata(product, lang);
  
  // Add proper hreflang alternates
  const LANGUAGES = [
    { code: "uz", name: "O'zbekcha" },
    { code: "ru", name: "Русский" },
  ];
  
  const alternateLocales = LANGUAGES.map((l) => ({
    locale: l.code,
    url: `/${l.code}/products/${id}`,
  }));

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: alternateLocales.reduce((acc, alt) => {
        acc[alt.locale] = alt.url;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const product = await fetchProductDetail(id, lang);
  const t = await getTranslations("product");

  if (!product) {
    return <>{children}</>;
  }

  const sellerName = product.seller
    ? `${product.seller.f_name || ""} ${product.seller.l_name || ""}`.trim() || "Venu"
    : undefined;

  const breadcrumbItems = [
    { name: t("home"), url: `/${lang}` },
    ...(product.category
      ? [
          {
            name: product.category.name,
            url: `/${lang}/search?category=${product.category.id}`,
          },
        ]
      : []),
    { name: product.name, url: `/${lang}/products/${product.slug}` },
  ];

  return (
    <>
      <head>
        <StructuredData
          data={generateProductSchema({
            name: product.name,
            slug: product.slug,
            details: product.details,
            thumbnail: product.thumbnail,
            thumbnail_full_url: product.thumbnail_full_url,
            unit_price: product.unit_price,
            discount: product.discount,
            discount_type: product.discount_type,
            category: product.category,
            rating: product.rating,
            review_count: product.review_count || product.reviews_count,
            seller: sellerName ? { name: sellerName } : undefined,
          })}
        />
        <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      </head>
      {children}
    </>
  );
}
