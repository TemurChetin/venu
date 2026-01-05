/**
 * Server-side API utilities
 * For fetching data in server components and generateMetadata functions
 */

import axios from "axios";
import type { ProductDetailResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API || "";

/**
 * Fetch product detail on server side
 */
export async function fetchProductDetail(
  slug: string,
  locale: string = "uz"
): Promise<ProductDetailResponse | null> {
  try {
    const response = await axios.get<ProductDetailResponse>(
      `${API_BASE_URL}/api/v1/products/details/${slug}`,
      {
        headers: {
          lang: locale,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }
}
