import { useTranslations } from "next-intl";
import {
  StructuredData,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/components/seo/structured-data";
import { ProductDetailResponse } from "@/types/api";

interface ProductStructuredDataProps {
  product: ProductDetailResponse;
  lang: string;
}

export function ProductStructuredData({ product, lang }: ProductStructuredDataProps) {
  const t = useTranslations("product");

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
    </>
  );
}

