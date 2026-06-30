"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Check } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PaymentMethod } from "../types/checkout.types";

interface PaymentMethodSelectionProps {
  selectedPaymentMethod: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export const PaymentMethodSelection = memo(function PaymentMethodSelection({
  selectedPaymentMethod,
  onChange,
}: PaymentMethodSelectionProps) {
  const t = useTranslations("checkout");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <CreditCard className="h-5 w-5 text-primary" />
        {t("paymentMethod")}
      </h2>

      <RadioGroup
        value={selectedPaymentMethod}
        onValueChange={(value) => onChange(value as PaymentMethod)}
        className="grid grid-cols-2 gap-4"
      >
        <Label
          htmlFor="payme"
          className="relative flex bg-[#10ACAF] items-center justify-center rounded-lg border border-border p-4 transition-all cursor-pointer"
        >
          {selectedPaymentMethod === "payme" && (
            <div className="flex items-center justify-center absolute top-2 right-2 h-5 w-5 rounded-full bg-white">
              <Check className="h-3 w-3 text-[#10ACAF]" />
            </div>
          )}
          <RadioGroupItem value="payme" id="payme" className="sr-only" />
          <Image
            width={400}
            height={90}
            src="/payme.png"
            alt="Payme"
            className="h-8 object-contain"
          />
        </Label>

        <Label
          htmlFor="click"
          className="relative flex bg-blue-500 items-center justify-center rounded-lg border border-border p-4 transition-all cursor-pointer"
        >
          {selectedPaymentMethod === "click" && (
            <div className="flex items-center justify-center absolute top-2 right-2 h-5 w-5 rounded-full bg-white">
              <Check className="h-3 w-3 text-blue-500" />
            </div>
          )}
          <RadioGroupItem value="click" id="click" className="sr-only" />
          <Image
            width={400}
            height={90}
            src="/click.png"
            alt="Click"
            className="h-8 object-contain"
          />
        </Label>
      </RadioGroup>
    </div>
  );
});
