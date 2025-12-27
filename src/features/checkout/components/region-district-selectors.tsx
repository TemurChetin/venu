"use client";

import { Label } from "@/components/ui/label";
import type {
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import type { AddressFormData } from "../types/address-form.types";
import type { Region, District } from "@/services/queries/regions";

interface RegionDistrictSelectorsProps {
  register: UseFormRegister<AddressFormData>;
  errors: FieldErrors<AddressFormData>;
  regions: Region[];
  districts: District[];
  selectedRegionId: number;
  isRegionsLoading: boolean;
  regionsError: Error | null;
}

export function RegionDistrictSelectors({
  register,
  errors,
  regions,
  districts,
  selectedRegionId,
  isRegionsLoading,
  regionsError,
}: RegionDistrictSelectorsProps) {
  return (
    <>
      {/* Region */}
      <div>
        <Label htmlFor="region_id">
          Viloyat <span className="text-destructive">*</span>
        </Label>
        <select
          id="region_id"
          {...register("region_id", { valueAsNumber: true })}
          disabled={isRegionsLoading}
          className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value={0}>
            {isRegionsLoading
              ? "Yuklanmoqda..."
              : regionsError
              ? "Xatolik yuz berdi"
              : "Viloyatni tanlang"}
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        {errors.region_id && (
          <p className="mt-1 text-sm text-destructive">
            {errors.region_id.message}
          </p>
        )}
        {regionsError && (
          <p className="mt-1 text-sm text-destructive">
            Viloyatlar ro'yxatini yuklashda xatolik yuz berdi
          </p>
        )}
        {!isRegionsLoading && !regionsError && regions.length === 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            Viloyatlar topilmadi
          </p>
        )}
      </div>

      {/* District */}
      <div>
        <Label htmlFor="district_id">
          Tuman/Shahar <span className="text-destructive">*</span>
        </Label>
        <select
          id="district_id"
          {...register("district_id", { valueAsNumber: true })}
          disabled={!selectedRegionId || districts.length === 0}
          className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value={0}>Tumanni tanlang</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
        {errors.district_id && (
          <p className="mt-1 text-sm text-destructive">
            {errors.district_id.message}
          </p>
        )}
      </div>
    </>
  );
}

