"use client";

import { usePublicQuery } from "./use-public-query";
import type { Seller, ProductListResponse } from "@/types/api";

/**
 * Seller Query Hooks
 */

export interface SellerResponse {
  seller: Seller;
}

// Get seller information
export const useSeller = (sellerId: number | string) => {
  return usePublicQuery<SellerResponse>({
    url: "/v1/seller",
    query: { seller_id: sellerId },
    enabled: !!sellerId,
  });
};

// Get seller products
export const useSellerProducts = (
  sellerId: number | string,
  limit = 20,
  offset = 0,
  options?: {
    search?: string;
    category?: string;
    brand_ids?: string;
    product_id?: string;
    product_authors?: string;
    publishing_houses?: string;
    product_type?: string;
  }
) => {
  return usePublicQuery<ProductListResponse>({
    url: `/v1/seller/${sellerId}/products`,
    query: {
      limit,
      offset,
      ...(options?.search && { search: options.search }),
      ...(options?.category && { category: options.category }),
      ...(options?.brand_ids && { brand_ids: options.brand_ids }),
      ...(options?.product_id && { product_id: options.product_id }),
      ...(options?.product_authors && { product_authors: options.product_authors }),
      ...(options?.publishing_houses && { publishing_houses: options.publishing_houses }),
      ...(options?.product_type && { product_type: options.product_type }),
    },
    enabled: !!sellerId,
  });
};
