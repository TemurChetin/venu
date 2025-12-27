"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AddressFormData } from "../types/address-form.types";

interface AddressInputFieldProps {
  register: UseFormRegister<AddressFormData>;
  errors: FieldErrors<AddressFormData>;
  mapAddress?: string;
}

export function AddressInputField({
  register,
  errors,
  mapAddress,
}: AddressInputFieldProps) {
  return (
    <div>
      <Label htmlFor="address">
        Manzil <span className="text-destructive">*</span>
      </Label>
      <Input
        id="address"
        placeholder="Manzilni kiriting yoki xaritadan tanlang"
        {...register("address")}
        className="mt-2"
      />
      {errors.address && (
        <p className="mt-1 text-sm text-destructive">
          {errors.address.message}
        </p>
      )}
      {mapAddress && (
        <p className="mt-1 text-xs text-muted-foreground">
          Xaritadan tanlangan: {mapAddress}
        </p>
      )}
    </div>
  );
}

