"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UseFormSetValue } from "react-hook-form";
import type { AddressFormData } from "../types/address-form.types";

interface AddressTypeSelectorProps {
  value: "home" | "office" | "other";
  setValue: UseFormSetValue<AddressFormData>;
}

export function AddressTypeSelector({
  value,
  setValue,
}: AddressTypeSelectorProps) {
  return (
    <div>
      <Label className="mb-3 block">Manzil turi</Label>
      <RadioGroup
        value={value}
        onValueChange={(newValue) =>
          setValue("address_type", newValue as "home" | "office" | "other")
        }
        className="grid grid-cols-3 gap-3"
      >
        <div className="flex items-center space-x-2 rounded-lg border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="home" id="home" />
          <Label htmlFor="home" className="cursor-pointer font-normal">
            Uy
          </Label>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="office" id="office" />
          <Label htmlFor="office" className="cursor-pointer font-normal">
            Ofis
          </Label>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other" className="cursor-pointer font-normal">
            Boshqa
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

