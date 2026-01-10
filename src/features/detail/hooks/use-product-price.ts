import { useMemo } from "react";
import { ProductDetailResponse } from "@/types/api";

interface PriceInfo {
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
}

export function useProductPrice(product: ProductDetailResponse | undefined): PriceInfo | null {
  return useMemo(() => {
    if (!product) return null;

    const originalPrice = product.unit_price;
    let discountedPrice = originalPrice;

    if (product.discount > 0) {
      if (product.discount_type === "percentage") {
        discountedPrice = originalPrice * (1 - product.discount / 100);
      } else {
        discountedPrice = originalPrice - product.discount;
      }
    }

    const discountPercent =
      product.discount > 0
        ? product.discount_type === "percentage"
          ? product.discount
          : Math.round((product.discount / originalPrice) * 100)
        : 0;

    return {
      originalPrice,
      discountedPrice,
      discountPercent,
    };
  }, [product]);
}


