"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddressForm } from "./hooks/use-address-form";
import {
  AddressTypeSelector,
  ContactPersonFields,
  RegionDistrictSelectors,
  AddressInputField,
  AddressMapSelector,
  BillingCheckbox,
} from "./components";
import type { InitialAddressData } from "./types/address-form.types";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InitialAddressData;
}

export function AddAddressModal({
  isOpen,
  onClose,
  initialData,
}: AddAddressModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    errors,
    regions,
    districts,
    selectedRegionId,
    isRegionsLoading,
    regionsError,
    mapAddress,
    markerCoords,
    handleMapLocationChange,
    handleMapAddressChange,
    isSubmitting,
  } = useAddressForm({
    initialData,
    onSuccess: onClose,
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  // Get initial coordinates for map
  const initialCoords: [number, number] | undefined =
    initialData?.latitude && initialData?.longitude
      ? [initialData.longitude, initialData.latitude]
      : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yangi manzil qo'shish</DialogTitle>
          <DialogDescription>
            Yetkazib berish uchun yangi manzil qo'shing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AddressTypeSelector
            value={watch("address_type")}
            setValue={setValue}
          />

          <ContactPersonFields
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <RegionDistrictSelectors
            register={register}
            errors={errors}
            regions={regions}
            districts={districts}
            selectedRegionId={selectedRegionId}
            isRegionsLoading={isRegionsLoading}
            regionsError={regionsError}
          />

          <BillingCheckbox
            checked={watch("is_billing")}
            onCheckedChange={(checked) => setValue("is_billing", checked)}
          />

          <AddressInputField
            register={register}
            errors={errors}
            mapAddress={mapAddress}
          />

          <AddressMapSelector
            initialCoords={initialCoords}
            onLocationChange={handleMapLocationChange}
            onAddressChange={handleMapAddressChange}
          />

          {/* Hidden inputs for form submission */}
          <input type="hidden" {...register("city")} />
          <input type="hidden" {...register("country")} />
          <input type="hidden" {...register("zip")} />
          <input type="hidden" {...register("latitude")} />
          <input type="hidden" {...register("longitude")} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </DialogFooter>

          {/* Debug: Show form errors in development */}
          {process.env.NODE_ENV === "development" &&
            Object.keys(errors).length > 0 && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                <p className="font-semibold">Form validation errors:</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([key, error]: [string, any]) => (
                    <li key={key}>
                      <strong>{key}:</strong>{" "}
                      {error?.message || JSON.stringify(error)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
