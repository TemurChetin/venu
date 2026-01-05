/**
 * Structured Data (JSON-LD) Component
 * Adds schema.org structured data for better SEO
 */

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://venu.uz";
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Venu",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "O'zbekistondagi eng yirik onlayn do'kon",
    sameAs: [
      // Add social media links here
      // "https://www.facebook.com/venu.uz",
      // "https://www.instagram.com/venu.uz",
      // "https://t.me/venu_uz",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["uz", "ru"],
    },
  };
}

/**
 * Generate Website structured data
 */
export function generateWebsiteSchema() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://venu.uz";
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Venu",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/{lang}/search?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product: {
  name: string;
  slug: string;
  details?: string;
  thumbnail?: string;
  thumbnail_full_url?: { path: string };
  unit_price: number;
  discount?: number;
  discount_type?: string;
  category?: { name: string };
  rating?: number[];
  review_count?: number;
  seller?: {
    name: string;
  };
}) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://venu.uz";
  
  // Calculate price
  let finalPrice = product.unit_price;
  if (product.discount && product.discount > 0) {
    if (product.discount_type === "percentage") {
      finalPrice = product.unit_price * (1 - product.discount / 100);
    } else {
      finalPrice = product.unit_price - product.discount;
    }
  }

  // Calculate average rating
  const averageRating =
    product.rating && product.rating.length > 0
      ? product.rating.reduce((a, b) => a + b, 0) / product.rating.length
      : 0;

  const image =
    product.thumbnail_full_url?.path ||
    product.thumbnail ||
    `${SITE_URL}/logo.png`;

  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.details
      ? product.details.replace(/<[^>]*>/g, "").substring(0, 200)
      : `${product.name} - ${product.category?.name || ""} kategoriyasidagi mahsulot`,
    image: fullImage,
    sku: product.slug,
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: "Venu",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "UZS",
      price: Math.round(finalPrice),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": product.seller ? "Organization" : "Organization",
        name: product.seller?.name || "Venu",
      },
    },
    ...(averageRating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: product.review_count || 0,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://venu.uz";
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

