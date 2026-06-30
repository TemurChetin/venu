"use client";

import { memo } from "react";
import Image from "next/image";
import { useFormatCurrency } from "@/lib/format-currency";
import type { CartItem } from "@/types/api";
import { getItemDiscount } from "../utils/discount";

interface OrderSummaryItemProps {
  item: CartItem;
}

export const OrderSummaryItem = memo(function OrderSummaryItem({
  item,
}: OrderSummaryItemProps) {
  const formatCurrency = useFormatCurrency();

  const itemName =
    item.name ||
    item.product?.name ||
    item.product_full_info?.name ||
    "Product";

  const thumbnailUrl =
    item.product?.thumbnail_full_url?.path || "/placeholder.svg";

  const { originalPrice, discount, isPercent, hasDiscount, discountedPrice } =
    getItemDiscount(item);

  const discountText = hasDiscount
    ? isPercent
      ? `-${discount}%`
      : `-${formatCurrency(discount)}`
    : null;

  return (
    <div className="flex gap-3 relative">
      {/* Discount Badge */}
      {discountText && (
        <div className="absolute left-0 top-0 z-10 flex items-center justify-center rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
          {discountText}
        </div>
      )}
      <Image
        width={700}
        height={700}
        sizes="80px"
        src={thumbnailUrl}
        alt={itemName}
        className="h-20 w-20 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="line-clamp-2 text-sm font-medium">{itemName}</h3>
        <div className="mt-1 space-y-0.5">
          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">
              {formatCurrency(originalPrice)} x {item.quantity}
            </p>
          )}
          <p className="text-sm font-semibold">
            {formatCurrency(discountedPrice)} x {item.quantity}
          </p>
        </div>
      </div>
    </div>
  );
});
