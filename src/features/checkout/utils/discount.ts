import type { CartItem } from "@/types/api";

export interface ItemDiscount {
  originalPrice: number;
  discount: number;
  discountType: string;
  isPercent: boolean;
  discountAmount: number;
  hasDiscount: boolean;
  discountedPrice: number;
}

/**
 * Bitta savat item'i bo'yicha chegirma hisobi.
 * Avval `totalDiscount` va order-summary item satrida ikki marta takrorlangan
 * mantiq shu yerda birlashtirildi.
 */
export function getItemDiscount(item: CartItem): ItemDiscount {
  const product = item.product_full_info || item.product;
  const originalPrice = product?.unit_price || item.price || 0;
  const discount = product?.discount || 0;
  const discountType = product?.discount_type || "";
  const isPercent = discountType === "percentage" || discountType === "percent";

  const discountAmount =
    discount > 0 ? (isPercent ? (originalPrice * discount) / 100 : discount) : 0;

  const hasDiscount = discount > 0 && discountAmount > 0;
  const discountedPrice = hasDiscount
    ? originalPrice - discountAmount
    : item.price;

  return {
    originalPrice,
    discount,
    discountType,
    isPercent,
    discountAmount,
    hasDiscount,
    discountedPrice,
  };
}
