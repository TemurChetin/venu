"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Navigation, Loader2, CheckCircle2 } from "lucide-react";
import { useAddAddress } from "@/services/queries/addresses";
import { useRegions, useDistricts } from "@/services/queries/regions";

declare global {
  interface Window {
    ymaps: any;
  }
}

const TASHKENT_CENTER = [41.2995, 69.2401];

const addressSchema = z.object({
  address_type: z.enum(["home", "office", "other"]),
  address: z
    .string()
    .min(10, "Manzil kamida 10 ta belgidan iborat bo'lishi kerak"),
  city: z.string().min(1, "Shahar/Viloyat talab qilinadi"),
  country: z.string().optional(),
  zip: z.string().optional(),
  contact_person_name: z
    .string()
    .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  contact_person_number: z
    .string()
    .regex(/^\+998\d{9}$/, "To'g'ri telefon raqam kiriting (+998901234567)"),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, "To'g'ri telefon raqam kiriting (+998901234567)"),
  region_id: z.number().min(1, "Viloyatni tanlang"),
  district_id: z.number().min(1, "Tumanni tanlang"),
  is_billing: z.boolean(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    address: string;
    city?: string;
    country?: string;
    zip?: string;
    region?: string;
    district?: string;
    latitude?: number;
    longitude?: number;
  };
}

export function AddAddressModal({
  isOpen,
  onClose,
  initialData,
}: AddAddressModalProps) {
  const addAddress = useAddAddress();
  const {
    data: regions = [],
    isLoading: isRegionsLoading,
    error: regionsError,
  } = useRegions();

  // Map state
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const [mapAddress, setMapAddress] = useState<string>("");
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCoords, setMapCoords] = useState<number[]>(
    initialData?.latitude && initialData?.longitude
      ? [initialData.latitude, initialData.longitude]
      : TASHKENT_CENTER
  );

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
      phone: "+998", // Will be synced with contact_person_number
      region_id: 0,
      district_id: 0,
      is_billing: false,
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
    },
  });

  // Watch region_id to load districts
  const selectedRegionId = watch("region_id");
  const { data: districts = [] } = useDistricts(selectedRegionId);

  // Map functions - get address from coordinates
  const getAddressFromMap = useCallback(
    (coords: number[]) => {
      if (!window.ymaps) return;

      setIsSearching(true);
      window.ymaps
        .geocode(coords)
        .then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const addr = firstGeoObject.getAddressLine();
            setMapAddress(addr);
            // Update form address field if empty
            const currentAddress = getValues("address");
            if (!currentAddress || currentAddress.length < 10) {
              setValue("address", addr, { shouldValidate: true });
            }

            // Extract additional info
            const geoObjects = res.geoObjects;
            if (geoObjects && geoObjects.length > 0) {
              const geoObj = geoObjects.get(0);
              const components = geoObj.getAddressLine();
              // Try to extract city, country, etc. if needed
            }
          }
          setIsSearching(false);
        })
        .catch(() => {
          setIsSearching(false);
        });
    },
    [setValue, getValues]
  );

  // Initialize map
  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstance.current) return;

    if (!window.ymaps) {
      console.warn("Yandex Maps not loaded yet");
      return;
    }

    window.ymaps.ready(() => {
      if (!mapRef.current || mapInstance.current) return;

      const initialCenter =
        initialData?.latitude && initialData?.longitude
          ? [initialData.latitude, initialData.longitude]
          : TASHKENT_CENTER;

      try {
        mapInstance.current = new window.ymaps.Map(
          mapRef.current,
          {
            center: initialCenter,
            zoom: 16,
            controls: ["zoomControl"],
          },
          {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
          }
        );

        // When map moves, get address from center
        mapInstance.current.events.add("actionend", () => {
          if (mapInstance.current) {
            const newCenter = mapInstance.current.getCenter();
            const [lat, lng] = newCenter;
            setMapCoords([lat, lng]);
            setValue("latitude", lat, { shouldValidate: false });
            setValue("longitude", lng, { shouldValidate: false });
            getAddressFromMap(newCenter);
          }
        });

        getAddressFromMap(initialCenter);
        setIsMapLoading(false);
      } catch (error) {
        console.error("Error initializing map:", error);
        setIsMapLoading(false);
      }
    });
  }, [initialData, setValue, getAddressFromMap]);

  // Locate user
  const locateMe = useCallback(() => {
    if (navigator.geolocation && mapInstance.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = [pos.coords.latitude, pos.coords.longitude];
          if (mapInstance.current) {
            mapInstance.current.setCenter(userCoords, 17, { duration: 500 });
          }
        },
        () => {
          console.warn("Geolocation not available");
        }
      );
    }
  }, []);

  // Initialize map when modal opens and Yandex Maps is ready
  useEffect(() => {
    if (!isOpen) return;

    // Check if Yandex Maps is already loaded
    if (window.ymaps && window.ymaps.ready) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (mapRef.current && !mapInstance.current) {
          initMap();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initMap]);

  // Cleanup map when modal closes
  useEffect(() => {
    if (!isOpen && mapInstance.current) {
      try {
        mapInstance.current.destroy();
      } catch (error) {
        console.error("Error destroying map:", error);
      }
      mapInstance.current = null;
      setIsMapLoading(true);
      setMapAddress("");
    }
  }, [isOpen]);

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

  // Update form when initialData changes
  useEffect(() => {
    if (!isOpen) return; // Only update when modal is open

    if (initialData?.address) {
      setValue("address", initialData.address);
    }
    if (initialData?.city) {
      setValue("city", initialData.city);
    }
    // Always set country to Uzbekistan
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
    // Set region first, then district will be available
    if (matchedRegionId) {
      setValue("region_id", matchedRegionId, { shouldValidate: true });
    }
  }, [initialData, matchedRegionId, isOpen, setValue]);

  // Track if we've already set district from initialData
  const hasSetDistrictFromInitialDataRef = useRef(false);

  // Set district after region is set and districts are loaded (only from initialData, once)
  useEffect(() => {
    if (
      !hasSetDistrictFromInitialDataRef.current &&
      matchedDistrictId &&
      selectedRegionId &&
      selectedRegionId > 0 &&
      districts.length > 0
    ) {
      // Only set once from initialData
      setValue("district_id", matchedDistrictId, { shouldValidate: true });
      hasSetDistrictFromInitialDataRef.current = true;
    }
  }, [matchedDistrictId, selectedRegionId, districts.length, setValue]);

  // Reset the ref when modal closes or initialData changes
  useEffect(() => {
    if (!isOpen) {
      hasSetDistrictFromInitialDataRef.current = false;
    }
  }, [isOpen]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      // Ensure phone matches contact_person_number and handle null values
      const submitData = {
        ...data,
        phone: data.contact_person_number,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
      };

      // Debug: Log form data before submission
      if (process.env.NODE_ENV === "development") {
        console.log("Submitting address data:", submitData);
      }

      await addAddress.mutateAsync(submitData);
      reset();
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Address submission error:", error);
    }
  };

  // Track previous region_id to detect changes
  const prevRegionIdRef = useRef<number | undefined>(undefined);

  // When region changes to a different region, reset district and update city
  useEffect(() => {
    const prevRegionId = prevRegionIdRef.current;

    // Only reset if region actually changed (not on initial mount or when setting from initialData)
    if (prevRegionId !== undefined && prevRegionId !== selectedRegionId) {
      // Region changed, reset district
      setValue("district_id", 0);
    }

    // Update city with region name when region is selected
    if (selectedRegionId && selectedRegionId > 0 && regions.length > 0) {
      const selectedRegion = regions.find((r) => r.id === selectedRegionId);
      if (selectedRegion) {
        setValue("city", selectedRegion.name, { shouldValidate: true });
      }
    }

    // Always set country to Uzbekistan
    setValue("country", "Uzbekistan", { shouldValidate: false });

    // Update ref with current region_id
    prevRegionIdRef.current = selectedRegionId;
  }, [selectedRegionId, regions, setValue]);

  const handleClose = () => {
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
    onClose();
  };

  return (
    <>
      {/* Yandex Maps Script */}
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=2abfe0ab-2d42-40c3-afad-e74cb318f0d6&lang=uz_UZ"
        strategy="lazyOnload"
        onLoad={() => {
          // Script loaded, map will be initialized by useEffect when modal opens
          console.log("Yandex Maps script loaded");
        }}
        onError={(e) => {
          console.error("Error loading Yandex Maps script:", e);
          setIsMapLoading(false);
        }}
      />

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yangi manzil qo'shish</DialogTitle>
            <DialogDescription>
              Yetkazib berish uchun yangi manzil qo'shing
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Address Type */}
            <div>
              <Label className="mb-3 block">Manzil turi</Label>
              <RadioGroup
                defaultValue="home"
                onValueChange={(value) =>
                  setValue("address_type", value as "home" | "office" | "other")
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
                  <Label
                    htmlFor="office"
                    className="cursor-pointer font-normal"
                  >
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
                Kontakt telefon raqam{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact_person_number"
                placeholder="+998901234567"
                {...register("contact_person_number", {
                  onChange: (e) => {
                    // Auto-sync phone with contact_person_number
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

            {/* Is Billing */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_billing"
                checked={watch("is_billing")}
                onCheckedChange={(checked) => setValue("is_billing", !!checked)}
              />
              <Label
                htmlFor="is_billing"
                className="text-sm font-normal cursor-pointer"
              >
                To'lov manzili sifatida belgilash
              </Label>
            </div>

            {/* Address Input */}
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

            {/* Map */}
            <div>
              <Label className="mb-2 block">Xaritadan manzil tanlash</Label>
              <div className="relative h-[300px] w-full rounded-lg border border-border overflow-hidden">
                {isMapLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}

                {/* Center marker */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                  <div className="relative mb-8 flex flex-col items-center">
                    <div className="bg-primary p-2 rounded-full shadow-xl border-4 border-white">
                      <MapPin size={24} className="text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div ref={mapRef} className="w-full h-full" />

                {/* Locate button */}
                <button
                  type="button"
                  onClick={locateMe}
                  className="absolute bottom-4 right-4 z-10 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
                  title="Mening joylashuvim"
                >
                  <Navigation size={20} className="text-primary" />
                </button>
              </div>
            </div>

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
              <Button type="submit" disabled={addAddress.isPending}>
                {addAddress.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </DialogFooter>

            {/* Debug: Show form errors in development */}
            {process.env.NODE_ENV === "development" &&
              Object.keys(errors).length > 0 && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  <p className="font-semibold">Form validation errors:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    {Object.entries(errors).map(
                      ([key, error]: [string, any]) => (
                        <li key={key}>
                          <strong>{key}:</strong>{" "}
                          {error?.message || JSON.stringify(error)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
