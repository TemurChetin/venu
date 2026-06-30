"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Address } from "@/types/api";

interface AddressSelectionProps {
  addresses: Address[] | undefined;
  selectedAddressId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
}

export const AddressSelection = memo(function AddressSelection({
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
}: AddressSelectionProps) {
  const t = useTranslations("checkout");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <User className="h-5 w-5 text-primary" />
          {t("deliveryAddress")}
        </h2>
        <Button type="button" variant="outline" size="sm" onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addNewAddress")}
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        <RadioGroup
          value={selectedAddressId?.toString() || ""}
          onValueChange={(value) => onSelect(parseInt(value, 10))}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <div className="flex items-center space-x-3 flex-1">
                <RadioGroupItem
                  value={address.id.toString()}
                  id={`address-${address.id}`}
                />
                <Label
                  htmlFor={`address-${address.id}`}
                  className="flex flex-col items-start cursor-pointer font-normal flex-1"
                >
                  <div className="font-semibold">
                    {address.contact_person_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {address.address}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {address.phone} • {address.address_type}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground mb-4">{t("noAddresses")}</p>
          <Button onClick={onAddNew}>{t("addAddress")}</Button>
        </div>
      )}
    </div>
  );
});
