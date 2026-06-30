"use client";

import { useMemo } from "react";
import type { CartItem } from "@/types/api";
import type { ConfigResponse } from "@/services/queries/config";
import { getItemDiscount } from "../utils/discount";

/**
 * Faqat savat + config'ga bog'liq narx hisoblari (memoized).
 */
export function useCheckoutPricing(
  cartItems: CartItem[],
  config: ConfigResponse | null,
) {
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0,
      ),
    [cartItems],
  );

  const totalDiscount = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const { discountAmount } = getItemDiscount(item);
        return sum + discountAmount * (item.quantity || 0);
      }, 0),
    [cartItems],
  );

  const exchangeRate = config?.uzsCurrency?.exchange_rate || 0;
  const isFreeDeliveryEligible = subtotal * exchangeRate >= 1000000;
  const howMuchToAdd = 1000000 - subtotal * exchangeRate;

  return { subtotal, totalDiscount, isFreeDeliveryEligible, howMuchToAdd };
}
