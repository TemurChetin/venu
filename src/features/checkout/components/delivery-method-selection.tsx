"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatUZS } from "@/lib/format-currency";
import type { DeliveryMethod } from "@/types/api";
import type { DeliveryMethodCode } from "../types/checkout.types";

interface DeliveryMethodSelectionProps {
  deliveryMethods: DeliveryMethod[];
  selectedDeliveryMethod: DeliveryMethodCode | null;
  deliveryCost: number | null;
  isFreeDeliveryEligible: boolean;
  onChange: (value: string) => void;
}

export const DeliveryMethodSelection = memo(function DeliveryMethodSelection({
  deliveryMethods,
  selectedDeliveryMethod,
  deliveryCost,
  isFreeDeliveryEligible,
  onChange,
}: DeliveryMethodSelectionProps) {
  const t = useTranslations("checkout");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <Truck className="h-5 w-5 text-primary" />
        {t("deliveryMethod")}
      </h2>

      <RadioGroup
        value={selectedDeliveryMethod || ""}
        onValueChange={onChange}
        className="space-y-3"
      >
        {deliveryMethods.map((method) => {
          const isFree = method.code === "free";
          const isDisabled = isFree && !isFreeDeliveryEligible;
          const cost =
            isFree || isFreeDeliveryEligible
              ? 0
              : method.code === selectedDeliveryMethod && deliveryCost !== null
                ? deliveryCost
                : null;

          return (
            <div
              key={method.code}
              className={`flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 ${
                isDisabled ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <RadioGroupItem
                  value={method.code}
                  id={method.code}
                  disabled={isDisabled}
                />
                <Label
                  htmlFor={method.code}
                  className={`cursor-pointer font-normal flex-1 ${
                    isDisabled ? "cursor-not-allowed" : ""
                  }`}
                >
                  <div className="font-semibold">{method.title}</div>
                  {isFree && (
                    <div className="text-sm text-muted-foreground">
                      {isFreeDeliveryEligible
                        ? t("freeDeliveryEligible")
                        : t("freeDeliveryOnly")}
                    </div>
                  )}
                </Label>
              </div>
              <span className="font-semibold">
                {cost === null ? null : cost === 0 ? (
                  <span className="text-green-600">{t("free")}</span>
                ) : (
                  formatUZS(cost)
                )}
              </span>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
});
