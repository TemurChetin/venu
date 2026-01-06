import type { Metadata } from "next";

/**
 * SEO Metadata Utility
 * Generates comprehensive SEO metadata including Open Graph and Twitter Cards
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://venu.uz";
const SITE_NAME = "Venu";
const DEFAULT_DESCRIPTION = {
  uz: "Venu - O'zbekistondagi eng yirik onlayn do'kon. Turli xil mahsulotlar, tez yetkazib berish va xavfsiz to'lov.",
  ru: "Venu - крупнейший интернет-магазин в Узбекистане. Разнообразные товары, быстрая доставка и безопасная оплата.",
  en: "Venu - Uzbekistan's largest online store. Various products, fast delivery and secure payment.",
  jp: "Venu - ウズベキスタン最大のオンラインストア。多様な製品、迅速な配達、安全な支払い。",
};

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  locale?: string;
  alternateLocales?: Array<{ locale: string; url: string }>;
  price?: {
    amount: number;
    currency: string;
  };
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  isProduct?: boolean; // Flag to indicate product page
}

/**
 * Generate comprehensive SEO metadata
 */
export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  locale = "uz",
  alternateLocales = [],
  price,
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
  isProduct = false,
}: GenerateMetadataOptions): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Onlayn do'kon`;
  const fullDescription =
    description ||
    DEFAULT_DESCRIPTION[locale as keyof typeof DEFAULT_DESCRIPTION] ||
    DEFAULT_DESCRIPTION.uz;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}/logo.png`;

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: fullUrl,
      languages: alternateLocales.reduce((acc, alt) => {
        acc[alt.locale] = alt.url;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      type: type, // Always use valid OpenGraph type (website or article)
      locale: locale,
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: `@${SITE_NAME.toLowerCase()}`,
      site: `@${SITE_NAME.toLowerCase()}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add verification codes here if needed
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
    },
  };

  // Add product-specific metadata using other field
  if (isProduct && price) {
    const existingOther = metadata.other as
      | Record<string, string | number | (string | number)[]>
      | undefined;
    metadata.other = {
      ...(existingOther || {}),
      "product:price:amount": price.amount.toString(),
      "product:price:currency": price.currency,
    };
  }

  return metadata;
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(
  product: {
    name: string;
    slug: string;
    details?: string;
    thumbnail?: string;
    thumbnail_full_url?: { path: string };
    unit_price: number;
    discount?: number;
    discount_type?: string;
    category?: { name: string };
  },
  locale: string = "uz"
): Metadata {
  const description = product.details
    ? product.details.replace(/<[^>]*>/g, "").substring(0, 160)
    : `${product.name} - ${
        product.category?.name || ""
      } kategoriyasidagi mahsulot. Venu do'konida xarid qiling.`;

  const image =
    product.thumbnail_full_url?.path || product.thumbnail || "/logo.png";

  // Calculate price
  let finalPrice = product.unit_price;
  if (product.discount && product.discount > 0) {
    if (product.discount_type === "percentage") {
      finalPrice = product.unit_price * (1 - product.discount / 100);
    } else {
      finalPrice = product.unit_price - product.discount;
    }
  }

  const keywords = [
    product.name,
    product.category?.name,
    "venu",
    "onlayn do'kon",
    "xarid qilish",
  ].filter(Boolean) as string[];

  return generateMetadata({
    title: product.name,
    description,
    image,
    url: `/${locale}/products/${product.slug}`,
    type: "website", // OpenGraph doesn't support "product" type
    locale,
    isProduct: true, // Flag to add product-specific metadata
    price: {
      amount: Math.round(finalPrice),
      currency: "UZS",
    },
    keywords,
  });
}

/**
 * Generate metadata for home page
 */
export function generateHomeMetadata(locale: string = "uz"): Metadata {
  return generateMetadata({
    title: undefined, // Will use default
    description:
      DEFAULT_DESCRIPTION[locale as keyof typeof DEFAULT_DESCRIPTION] ||
      DEFAULT_DESCRIPTION.uz,
    image: "/logo.png",
    url: `/${locale}`,
    type: "website",
    locale,
    keywords: [
      "venu",
      "onlayn do'kon",
      "xarid qilish",
      "yetkazib berish",
      "elektronika",
      "kiyim",
      "uy-ro'zg'or buyumlari",
    ],
  });
}

/**
 * Generate metadata for search page
 */
export function generateSearchMetadata(
  query?: string,
  locale: string = "uz"
): Metadata {
  const title = query
    ? `"${query}" qidiruv natijalari`
    : "Mahsulotlarni qidirish";
  const description = query
    ? `"${query}" bo'yicha topilgan mahsulotlar. Venu do'konida eng yaxshi narxlar va sifat.`
    : "Venu do'konida mahsulotlarni qidiring. Keng assortiment va qulay narxlar.";

  return generateMetadata({
    title,
    description,
    url: query
      ? `/${locale}/search?q=${encodeURIComponent(query)}`
      : `/${locale}/search`,
    type: "website",
    locale,
    keywords: query
      ? [query, "qidiruv", "mahsulotlar"]
      : ["qidiruv", "mahsulotlar"],
  });
}
