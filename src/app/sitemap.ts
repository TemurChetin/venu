import { MetadataRoute } from "next";

const BASE_URL = "https://venu.uz";
const API_URL = "https://api.venu.uz/api/v1/products/filter?guest_id=872103";

interface Product {
  slug: string;
  updated_at: string;
}

async function getAllProducts(): Promise<Product[]> {
  let allProducts: Product[] = [];
  let offset = 0;
  const limit = 20; // API yuklamasini kamaytirish uchun 100 tadan olamiz
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          lang: "ru",
        },
        body: JSON.stringify({
          search: "",
          category: "[]",
          brand: "[]",
          product_authors: "[]",
          publishing_houses: "[]",
          sort_by: null,
          price_min: null,
          price_max: null,
          limit: limit.toString(),
          offset: offset,
          product_type: "all",
        }),
      });

      const data = await response.json();

      if (data.products && data.products.length > 0) {
        allProducts = [...allProducts, ...data.products];
        offset += limit;

        // Agar olingan mahsulotlar soni jami sondan ko'p yoki teng bo'lsa to'xtatamiz
        if (allProducts.length >= data.total_size) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }
  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  return allProducts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  // 1. Asosiy sahifalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/uz`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/ru`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Auth sahifalari
    {
      url: `${BASE_URL}/uz/auth`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/ru/auth`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Checkout sahifalari
    {
      url: `${BASE_URL}/uz/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/ru/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    // Orders sahifalari
    {
      url: `${BASE_URL}/uz/orders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/ru/orders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    // Settings sahifalari
    {
      url: `${BASE_URL}/uz/settings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/ru/settings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Search sahifalari
    {
      url: `${BASE_URL}/uz/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ru/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Business sahifalari - About Us
    {
      url: `${BASE_URL}/uz/business-page/biz-haqimizda-o-nas-about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ru/business-page/biz-haqimizda-o-nas-about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Business sahifalari - Privacy Policy
    {
      url: `${BASE_URL}/uz/business-page/maxfiylik-siyosati-politika-konfidencialnosti-privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ru/business-page/maxfiylik-siyosati-politika-konfidencialnosti-privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Business sahifalari - Promo Code
    {
      url: `${BASE_URL}/uz/business-page/promokod-haqida`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ru/business-page/promokod-haqida`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. API dan kelgan mahsulot sahifalari - har bir til uchun
  const productPages: MetadataRoute.Sitemap = products.flatMap((product) => [
    {
      url: `${BASE_URL}/uz/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ru/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]);

  return [...staticPages, ...productPages];
}
