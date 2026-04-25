import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegions, useDistricts } from "@/services/queries/regions";
import { useAddAddress } from "@/services/queries/addresses";
import {
  addressSchema,
  type AddressFormData,
  type InitialAddressData,
  TASHKENT_CENTER,
} from "../types/address-form.types";

// Yandex ba'zan Kiril harflarida qaytaradi — ularni Lotin yozuviga o'tkazamiz
function cyrillicToLatin(text: string): string {
  const map: Record<string, string> = {
    "А": "a","Б": "b","В": "v","Г": "g","Д": "d","Е": "e","Ё": "yo","Ж": "j","З": "z",
    "И": "i","Й": "y","К": "k","Л": "l","М": "m","Н": "n","О": "o","П": "p","Р": "r",
    "С": "s","Т": "t","У": "u","Ф": "f","Х": "x","Ч": "ch","Ш": "sh","Ъ": "","Ы": "i",
    "Ь": "","Э": "e","Ю": "yu","Я": "ya","Ғ": "g'","Қ": "q","Ҳ": "h","Ў": "o'","Ҷ": "j",
    "Ц": "ts","Щ": "sh",
    "а": "a","б": "b","в": "v","г": "g","д": "d","е": "e","ё": "yo","ж": "j","з": "z",
    "и": "i","й": "y","к": "k","л": "l","м": "m","н": "n","о": "o","п": "p","р": "r",
    "с": "s","т": "t","у": "u","ф": "f","х": "x","ч": "ch","ш": "sh","ъ": "","ы": "i",
    "ь": "","э": "e","ю": "yu","я": "ya","ғ": "g'","қ": "q","ҳ": "h","ў": "o'","ҷ": "j",
    "ц": "ts","щ": "sh",
  };
  return text.split("").map((c) => map[c] ?? c).join("");
}

// "Toshkent viloyati" → "toshkent", "Yunusobod tumani" → "yunusobod"
function stripAdminSuffix(name: string): string {
  return cyrillicToLatin(name)
    .toLowerCase()
    .replace(/[\r\n]/g, "")
    .replace(
      /\s+(viloyati?|shahri?|shahar|tumani?|tuman|respublikasi?|oblast[i]?|область|вилояти?|шаҳри?|шаҳар|тумани?|туман)\s*$/i,
      ""
    )
    .trim();
}

function matchesName(apiName: string, geocodedName: string): boolean {
  const a = cyrillicToLatin(apiName).toLowerCase().replace(/[\r\n]/g, "").trim();
  const g = cyrillicToLatin(geocodedName).toLowerCase().trim();
  return a.includes(g) || g.includes(a);
}

function matchesNameBase(apiName: string, geocodedName: string): boolean {
  return stripAdminSuffix(apiName) === stripAdminSuffix(geocodedName);
}

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
      is_billing: true,
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
    },
  });

  const selectedRegionId = watch("region_id");
  const { data: districts = [] } = useDistricts(selectedRegionId);

  const [mapAddress, setMapAddress] = useState<string>("");
  const [geocodedRegionName, setGeocodedRegionName] = useState<string | null>(null);
  const [geocodedDistrictName, setGeocodedDistrictName] = useState<string | null>(null);

  // Find region and district IDs from initialData names
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

  const prevRegionIdRef = useRef<number | undefined>(undefined);
  const hasSetDistrictFromInitialDataRef = useRef(false);

  // Initialize form with initialData
  useEffect(() => {
    if (initialData?.address) setValue("address", initialData.address);
    if (initialData?.city) setValue("city", initialData.city);
    setValue("country", "Uzbekistan", { shouldValidate: false });
    if (initialData?.zip) setValue("zip", initialData.zip);
    if (initialData?.latitude) setValue("latitude", initialData.latitude);
    if (initialData?.longitude) setValue("longitude", initialData.longitude);
    if (matchedRegionId) setValue("region_id", matchedRegionId, { shouldValidate: true });
  }, [initialData, matchedRegionId, setValue]);

  // Set district from initialData after region + districts load
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

  // Auto-match geocoded region name from map
  useEffect(() => {
    if (!geocodedRegionName || regions.length === 0) return;
    // Exact/includes match first (preserves shahri vs viloyati distinction)
    const exact = regions.find((r) => matchesName(r.name, geocodedRegionName));
    if (exact) {
      setValue("region_id", exact.id, { shouldValidate: true });
      return;
    }
    // Fallback: base name match (strips suffixes)
    const base = regions.find((r) => matchesNameBase(r.name, geocodedRegionName));
    if (base) setValue("region_id", base.id, { shouldValidate: true });
  }, [geocodedRegionName, regions, setValue]);

  // Auto-match geocoded district name from map (after districts load for matched region)
  useEffect(() => {
    if (!geocodedDistrictName || districts.length === 0 || !selectedRegionId) return;
    const exact = districts.find((d) => matchesName(d.name, geocodedDistrictName));
    if (exact) {
      setValue("district_id", exact.id, { shouldValidate: true });
      return;
    }
    const base = districts.find((d) => matchesNameBase(d.name, geocodedDistrictName));
    if (base) setValue("district_id", base.id, { shouldValidate: true });
  }, [geocodedDistrictName, districts, selectedRegionId, setValue]);

  // When region changes, reset district and update city
  useEffect(() => {
    const prevRegionId = prevRegionIdRef.current;
    if (prevRegionId !== undefined && prevRegionId !== selectedRegionId) {
      setValue("district_id", 0);
    }
    if (selectedRegionId && selectedRegionId > 0 && regions.length > 0) {
      const selectedRegion = regions.find((r) => r.id === selectedRegionId);
      if (selectedRegion) setValue("city", selectedRegion.name, { shouldValidate: true });
    }
    setValue("country", "Uzbekistan", { shouldValidate: false });
    prevRegionIdRef.current = selectedRegionId;
  }, [selectedRegionId, regions, setValue]);

  const [markerCoords, setMarkerCoords] = useState<[number, number]>(() => {
    if (initialData?.latitude && initialData?.longitude) {
      return [initialData.longitude, initialData.latitude];
    }
    return TASHKENT_CENTER;
  });

  const handleMapLocationChange = useCallback(
    (coords: [number, number]) => {
      const [lng, lat] = coords;
      setMarkerCoords(coords);
      setValue("latitude", lat, { shouldValidate: false });
      setValue("longitude", lng, { shouldValidate: false });
    },
    [setValue]
  );

  const handleMapAddressChange = useCallback(
    (address: string, regionName?: string | null, districtName?: string | null) => {
      setMapAddress(address);
      const currentAddress = getValues("address");
      if (!currentAddress || currentAddress.length < 10) {
        setValue("address", address, { shouldValidate: true });
      }
      if (regionName) setGeocodedRegionName(regionName);
      if (districtName) setGeocodedDistrictName(districtName);
    },
    [getValues, setValue]
  );

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
      is_billing: true,
      latitude: undefined,
      longitude: undefined,
    });
    setMapAddress("");
    setGeocodedRegionName(null);
    setGeocodedDistrictName(null);
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
    isSubmitting: addAddress.isPending,
  };
}
