import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegions, useDistricts } from "@/services/queries/regions";
import { useAddAddress } from "@/services/queries/addresses";
import { geocodeCoordinates } from "@/lib/google-maps";
import env from "@/lib/env";
import {
  addressSchema,
  type AddressFormData,
  type InitialAddressData,
  TASHKENT_CENTER,
} from "../types/address-form.types";

interface UseAddressFormProps {
  initialData?: InitialAddressData;
  onSuccess?: () => void;
}

export function useAddressForm({ initialData, onSuccess }: UseAddressFormProps) {
  const addAddress = useAddAddress();
  const {
    data: regions = [],
    isLoading: isRegionsLoading,
    error: regionsError,
  } = useRegions();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_type: "home",
      address: initialData?.address || "",
      city: initialData?.city || "",
      country: initialData?.country || "Uzbekistan",
      zip: initialData?.zip || "",
      contact_person_number: "+998",
      phone: "+998",
      region_id: 0,
      district_id: 0,
      is_billing: false,
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
    },
  });

  const selectedRegionId = watch("region_id");
  const { data: districts = [] } = useDistricts(selectedRegionId);

  const [mapAddress, setMapAddress] = useState<string>("");
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Find region and district IDs from names
  const matchedRegionId = useMemo(() => {
    if (!initialData?.region || regions.length === 0) return undefined;
    const region = regions.find(
      (r) =>
        r.name.toLowerCase().includes(initialData.region!.toLowerCase()) ||
        initialData.region!.toLowerCase().includes(r.name.toLowerCase())
    );
    return region?.id;
  }, [initialData?.region, regions]);

  const matchedDistrictId = useMemo(() => {
    if (!initialData?.district || districts.length === 0 || !selectedRegionId)
      return undefined;
    const district = districts.find(
      (d) =>
        d.name.toLowerCase().includes(initialData.district!.toLowerCase()) ||
        initialData.district!.toLowerCase().includes(d.name.toLowerCase())
    );
    return district?.id;
  }, [initialData?.district, districts, selectedRegionId]);

  // Track previous region_id to detect changes
  const prevRegionIdRef = useRef<number | undefined>(undefined);
  const hasSetDistrictFromInitialDataRef = useRef(false);

  // Initialize form with initialData
  useEffect(() => {
    if (initialData?.address) {
      setValue("address", initialData.address);
    }
    if (initialData?.city) {
      setValue("city", initialData.city);
    }
    setValue("country", "Uzbekistan", { shouldValidate: false });
    if (initialData?.zip) {
      setValue("zip", initialData.zip);
    }
    if (initialData?.latitude) {
      setValue("latitude", initialData.latitude);
    }
    if (initialData?.longitude) {
      setValue("longitude", initialData.longitude);
    }
    if (matchedRegionId) {
      setValue("region_id", matchedRegionId, { shouldValidate: true });
    }
  }, [initialData, matchedRegionId, setValue]);

  // Set district after region is set and districts are loaded
  useEffect(() => {
    if (
      !hasSetDistrictFromInitialDataRef.current &&
      matchedDistrictId &&
      selectedRegionId &&
      selectedRegionId > 0 &&
      districts.length > 0
    ) {
      setValue("district_id", matchedDistrictId, { shouldValidate: true });
      hasSetDistrictFromInitialDataRef.current = true;
    }
  }, [matchedDistrictId, selectedRegionId, districts.length, setValue]);

  // When region changes, reset district and update city
  useEffect(() => {
    const prevRegionId = prevRegionIdRef.current;

    if (prevRegionId !== undefined && prevRegionId !== selectedRegionId) {
      setValue("district_id", 0);
    }

    if (selectedRegionId && selectedRegionId > 0 && regions.length > 0) {
      const selectedRegion = regions.find((r) => r.id === selectedRegionId);
      if (selectedRegion) {
        setValue("city", selectedRegion.name, { shouldValidate: true });
      }
    }

    setValue("country", "Uzbekistan", { shouldValidate: false });
    prevRegionIdRef.current = selectedRegionId;
  }, [selectedRegionId, regions, setValue]);

  // Get address from coordinates
  const getAddressFromMap = useCallback(
    async (coords: [number, number]) => {
      if (!apiKey) return;

      try {
        const address = await geocodeCoordinates(coords, apiKey);
        if (address) {
          setMapAddress(address);
          const currentAddress = getValues("address");
          if (!currentAddress || currentAddress.length < 10) {
            setValue("address", address, { shouldValidate: true });
          }
        } else {
          const [lng, lat] = coords;
          const addr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setMapAddress(addr);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    },
    [setValue, getValues, apiKey]
  );

  const [markerCoords, setMarkerCoords] = useState<[number, number]>(() => {
    if (initialData?.latitude && initialData?.longitude) {
      return [initialData.longitude, initialData.latitude];
    }
    return TASHKENT_CENTER;
  });

  // Handle map location change
  const handleMapLocationChange = useCallback(
    (coords: [number, number], address: string) => {
      const [lng, lat] = coords;
      setMarkerCoords(coords);
      setValue("latitude", lat, { shouldValidate: false });
      setValue("longitude", lng, { shouldValidate: false });
      getAddressFromMap(coords);
    },
    [setValue, getAddressFromMap]
  );

  const handleMapAddressChange = useCallback((address: string) => {
    setMapAddress(address);
    const currentAddress = getValues("address");
    if (!currentAddress || currentAddress.length < 10) {
      setValue("address", address, { shouldValidate: true });
    }
  }, [getValues, setValue]);

  const resetForm = useCallback(() => {
    reset({
      address_type: "home",
      address: "",
      city: "",
      country: "Uzbekistan",
      zip: "",
      contact_person_name: "",
      contact_person_number: "+998",
      phone: "+998",
      region_id: 0,
      district_id: 0,
      is_billing: false,
      latitude: undefined,
      longitude: undefined,
    });
    setMapAddress("");
    hasSetDistrictFromInitialDataRef.current = false;
  }, [reset]);

  const onSubmit = useCallback(
    async (data: AddressFormData) => {
      try {
        const submitData = {
          ...data,
          phone: data.contact_person_number,
          latitude: data.latitude ?? undefined,
          longitude: data.longitude ?? undefined,
        };

        if (process.env.NODE_ENV === "development") {
          console.log("Submitting address data:", submitData);
        }

        await addAddress.mutateAsync(submitData);
        resetForm();
        onSuccess?.();
      } catch (error) {
        console.error("Address submission error:", error);
      }
    },
    [addAddress, resetForm, onSuccess]
  );

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    setValue,
    reset: resetForm,
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
    getAddressFromMap,
    isSubmitting: addAddress.isPending,
  };
}

