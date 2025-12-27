"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { AddressFormData } from "../types/address-form.types";

interface ContactPersonFieldsProps {
  register: UseFormRegister<AddressFormData>;
  setValue: UseFormSetValue<AddressFormData>;
  errors: FieldErrors<AddressFormData>;
}

export function ContactPersonFields({
  register,
  setValue,
  errors,
}: ContactPersonFieldsProps) {
  return (
    <>
      {/* Contact Person Name */}
      <div>
        <Label htmlFor="contact_person_name">
          Kontakt shaxs ismi <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact_person_name"
          placeholder="Masalan: Abdullayev Abdulla"
          {...register("contact_person_name")}
          className="mt-2"
        />
        {errors.contact_person_name && (
          <p className="mt-1 text-sm text-destructive">
            {errors.contact_person_name.message}
          </p>
        )}
      </div>

      {/* Contact Person Number */}
      <div>
        <Label htmlFor="contact_person_number">
          Kontakt telefon raqam <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact_person_number"
          placeholder="+998901234567"
          {...register("contact_person_number", {
            onChange: (e) => {
              setValue("phone", e.target.value, { shouldValidate: true });
            },
          })}
          className="mt-2"
        />
        {errors.contact_person_number && (
          <p className="mt-1 text-sm text-destructive">
            {errors.contact_person_number.message}
          </p>
        )}
      </div>

      {/* Phone - Hidden, auto-filled from contact_person_number */}
      <input type="hidden" {...register("phone")} />
    </>
  );
}

