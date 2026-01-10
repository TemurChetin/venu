"use client";

import { usePublicQuery } from "./use-public-query";
import { useGuestId } from "../guest-id";
import type {
  BannersResponse,
  ProductDetailResponse,
  ProductReviewsResponse,
  CategoriesResponse,
  Product,
  ProductListResponse,
} from "@/types/api";

/**
 * Product Query Hooks
 * All hooks use the public query system with guest ID management
 */

// Banners
export const useBanners = () => {
  return usePublicQuery<BannersResponse[]>({
    url: "/v1/banners",
    enabled: true,
    requiresGuestId: false,
  });
};

// Latest Products
export const useLatestProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/latest",
    query: { limit, offset },
    enabled: true,
  });
};

// Seasonal Products
export const useSeasonalProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/seasonal",
    query: { limit, offset },
    enabled: true,
  });
};

// Discounted Products
export const useDiscountProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/discount",
    query: { limit, offset },
    enabled: true,
  });
};

// New Arrival Products
export const useNewArrivalProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/new-arrival",
    query: { limit, offset },
    enabled: true,
  });
};

// Top Rated Products
export const useTopRatedProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/top-rated",
    query: { limit, offset },
    enabled: true,
  });
};

// Best Selling Products
export const useBestSellingProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/best-sellings",
    query: { limit, offset },
    enabled: true,
  });
};

// Featured Products
export const useFeaturedProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/featured",
    query: { limit, offset },
    enabled: true,
  });
};

// Discounted Products
export const useDiscountedProducts = (limit = 10, offset = 0) => {
  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/discounted-product",
    query: { limit, offset },
    enabled: true,
  });
};

// Product Detail
export const useProductDetail = (productSlug: string) => {
  return usePublicQuery<ProductDetailResponse>({
    url: `/v1/products/details/${productSlug}`,
    enabled: !!productSlug,
  });
};

// Product Reviews
export const useProductReviews = (productSlug: string) => {
  return usePublicQuery<ProductReviewsResponse>({
    url: `/v1/products/reviews/${productSlug}`,
    enabled: !!productSlug,
    requiresGuestId: false, // Reviews don't need guestId
  });
};

// Related Products
export const useRelatedProducts = (
  productId?: number,
  limit = 10,
  offset = 0
) => {
  return usePublicQuery<Product[]>({
    url: `/v1/products/related-products/${productId}`,
    query: { limit, offset },
    enabled: !!productId,
  });
};

// Categories
export const useCategories = () => {
  return usePublicQuery<CategoriesResponse>({
    url: "/v1/categories/list",
    enabled: true,
    queryOptions: {
      select: (data: any): CategoriesResponse => {
        // Handle response structure: {"ok": [...]}
        if (
          data &&
          typeof data === "object" &&
          "ok" in data &&
          Array.isArray(data.ok)
        ) {
          return data.ok;
        }
        // Fallback: if data is already an array, return it
        return (Array.isArray(data) ? data : []) as CategoriesResponse;
      },
    },
  });
};

export const useAllCategories = () => {
  return useCategories();
};

// Brands (for filter)
export interface Brand {
  id: number;
  name: string;
  image?: string;
  image_full_url?: {
    key: string;
    path: string;
    status?: number;
  };
}

export interface BrandsResponse {
  brands: Brand[];
}

export const useBrands = () => {
  return usePublicQuery<BrandsResponse>({
    url: "/v1/brands",
    enabled: true,
  });
};

// Product Filter
export interface ProductFilterParams {
  search: string;
  category: number | null;
  brand: string;
  product_authors: string;
  publishing_houses: string;
  sort_by: string | null;
  price_min: number | null;
  price_max: number | null;
  limit: string;
  offset: number;
  product_type: string;
}

export const useProductFilter = (params: ProductFilterParams) => {
  const { isLoading: isLoadingGuestId } = useGuestId();

  // Stop here

  // If category is selected, use category-specific endpoint
  if (params.category && params.category > 0) {
    return usePublicQuery<ProductListResponse>({
      url: `/v1/categories/products/${params.category}`,
      query: {
        limit: params.limit || "20",
        offset: params.offset || 0,
      },
      enabled: !isLoadingGuestId,
    });
  }

  // Build filter payload according to ProductFilterParams interface
  const filterPayload: ProductFilterParams = {
    search: params.search || "",
    category: params.category || ("[]" as any),
    brand: params.brand || "[]",
    product_authors: params.product_authors || "[]",
    publishing_houses: params.publishing_houses || "[]",
    sort_by: params.sort_by,
    price_min: params.price_min,
    price_max: params.price_max,
    limit: params.limit || "20",
    offset: params.offset || 0,
    product_type: params.product_type || "all",
  };

  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/filter",
    enabled: !isLoadingGuestId,
    method: "POST",
    data: filterPayload,
  });
};

// Product Suggestion (for search autocomplete)
export interface ProductSuggestion {
  name: string;
  id?: number;
}

export interface ProductSuggestionResponse {
  products: ProductSuggestion[];
}

export const useProductSearch = (name: string) => {
  // Build filter payload according to ProductFilterParams interface
  const filterPayload: ProductFilterParams = {
    search: name || "",
    category: "[]" as any,
    brand: "[]",
    product_authors: "[]",
    publishing_houses: "[]",
    sort_by: null,
    price_min: null,
    price_max: null,
    limit: "20",
    offset: 0,
    product_type: "all",
  };

  return usePublicQuery<ProductListResponse>({
    url: "/v1/products/filter",
    method: "POST",
    data: filterPayload,
    debounceTime: 300,
  });
};
