"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormatCurrency, formatUZS } from "@/lib/format-currency";
import type { CartItem } from "@/types/api";
import type { ConfigResponse } from "@/services/queries/config";
import type { DeliveryMethodCode } from "../types/checkout.types";
import { OrderSummaryItem } from "./order-summary-item";

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  totalDiscount: number;
  isFreeDeliveryEligible: boolean;
  howMuchToAdd: number;
  deliveryCost: number | null;
  selectedDeliveryMethod: DeliveryMethodCode | null;
  config: ConfigResponse | null;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitDisabled: boolean;
}

export function OrderSummary({
  cartItems,
  subtotal,
  totalDiscount,
  isFreeDeliveryEligible,
  howMuchToAdd,
  deliveryCost,
  selectedDeliveryMethod,
  config,
  onSubmit,
  isSubmitting,
  submitDisabled,
}: OrderSummaryProps) {
  const t = useTranslations("checkout");
  const formatCurrency = useFormatCurrency();

  const finalDeliveryCost =
    selectedDeliveryMethod === "free" || isFreeDeliveryEligible
      ? 0
      : deliveryCost || 0;

  return (
    <div className="sticky top-4 space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">{t("orderSummary")}</h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {cartItems.map((item) => (
            <OrderSummaryItem key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
              {t("products")} ({cartItems.length})
            </span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Truck className="h-4 w-4" />
              {t("delivery")}
            </span>
            <span className="font-medium">
              {finalDeliveryCost === 0 ? (
                <span className="text-green-600">{t("free")}</span>
              ) : deliveryCost === null ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                formatUZS(finalDeliveryCost)
              )}
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                {t("discount")}
              </span>
              <span className="font-medium text-green-600">
                -{formatCurrency(totalDiscount)}
              </span>
            </div>
          )}

          {!isFreeDeliveryEligible && config?.uzsCurrency?.exchange_rate && (
            <p className="rounded-lg bg-primary/10 p-3 text-xs text-primary">
              {t("addMoreForFreeDelivery", {
                amount: formatUZS(howMuchToAdd),
              })}
            </p>
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={submitDisabled}
          className="mt-6 w-full bg-primary py-6 text-base font-semibold hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("creatingOrder")}
            </>
          ) : (
            t("confirmOrder")
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("termsAgreement")}{" "}
          <a href="#" className="text-primary hover:underline">
            {t("termsLink")}
          </a>{" "}
          {t("termsAgreementEnd")}
        </p>
      </div>
    </div>
  );
}
