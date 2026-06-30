"use client";

import { useMemo } from "react";
import { useCart } from "@/services";

/**
 * Checkout savati: useCart + faqat belgilangan (is_checked === 1) item'lar.
 */
export function useCheckoutCart() {
  const {
    data: cartData,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
    dataUpdatedAt: cartDataUpdatedAt,
  } = useCart();

  const cartItems = useMemo(
    () => (cartData || []).filter((item) => item.is_checked === 1),
    [cartData],
  );

  return {
    cartData,
    cartItems,
    isCartLoading,
    isCartFetching,
    cartDataUpdatedAt,
  };
}
