/**
 * Application Constants
 * Centralized configuration values
 */

// ===============================================================
// Language Configuration
// ===============================================================
export const LANGUAGES = [
  { code: "uz", name: "Uzbek" },
  { code: "ru", name: "Russian" },
  { code: "en", name: "English" },
  { code: "jp", name: "Japanese" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: Language = "uz";

// ===============================================================
// API Configuration
// ===============================================================
export const API_ENDPOINTS = {
  BANNERS: "/v1/banners",
  PRODUCTS: {
    LATEST: "/v1/products/latest",
    NEW_ARRIVAL: "/v1/products/new-arrival",
    TOP_RATED: "/v1/products/top-rated",
    BEST_SELLINGS: "/v1/products/best-sellings",
    FEATURED: "/v1/products/featured",
    DISCOUNTED: "/v1/products/discounted-product",
    DETAIL: (slug: string) => `/v1/products/details/${slug}`,
    REVIEWS: (slug: string) => `/v1/products/reviews/${slug}`,
    RELATED: (slug: string) => `/v1/products/related-products/${slug}`,
  },
  GUEST_ID: "/api/v1/get-guest-id",
} as const;

// ===============================================================
// Pagination Defaults
// ===============================================================
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
} as const;

// ===============================================================
// UI Constants
// ===============================================================
export const UI = {
  TOP_LOADER: {
    COLOR: "#ff0042",
    HEIGHT: 3,
    INITIAL_POSITION: 0.08,
    CRAWL_SPEED: 200,
    SPEED: 600,
  },
} as const;
