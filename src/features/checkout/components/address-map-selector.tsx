"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Navigation, Loader2, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { geocodeCoordinatesDetailed, geocodeAddressDetailed } from "@/lib/ymaps";
import env from "@/lib/env";
import { TASHKENT_CENTER } from "../types/address-form.types";

interface AddressMapSelectorProps {
  initialCoords?: [number, number];
  onLocationChange: (coords: [number, number], address: string) => void;
  onAddressChange: (
    address: string,
    regionName?: string | null,
    districtName?: string | null,
  ) => void;
}

// Convert [lng, lat] to [lat, lng] for Yandex Maps
const convertToYandexCoords = (coords: [number, number]): [number, number] => {
  return [coords[1], coords[0]]; // [lat, lng]
};

// Convert [lat, lng] to [lng, lat] for form
const convertFromYandexCoords = (
  coords: [number, number],
): [number, number] => {
  return [coords[1], coords[0]]; // [lng, lat]
};

export function AddressMapSelector({
  initialCoords,
  onLocationChange,
  onAddressChange,
}: AddressMapSelectorProps) {
  const [mapAddress, setMapAddress] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isTextSearching, setIsTextSearching] = useState(false);

  // Yandex Maps uses [lat, lng] format
  const [coords, setCoords] = useState<[number, number]>(() => {
    if (initialCoords) {
      return convertToYandexCoords(initialCoords);
    }
    return convertToYandexCoords(TASHKENT_CENTER);
  });

  const apiKey =
    env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY ||
    "5d059798-6f7f-453b-953a-c05de8365d6a";
  const [isLoaded, setIsLoaded] = useState(false);
  const hasInitialGeocoded = useRef(false);
  const mapRef = useRef<any>(null);

  const mapState = {
    center: coords,
    zoom: 16,
  };

  const getAddressFromMap = useCallback(
    async (yandexCoords: [number, number]) => {
      if (!apiKey) return;

      const formCoords = convertFromYandexCoords(yandexCoords);

      setIsSearching(true);
      try {
        const result = await geocodeCoordinatesDetailed(formCoords, apiKey);
        if (result.address) {
          setMapAddress(result.address);
          onAddressChange(
            result.address,
            result.regionName,
            result.districtName,
          );
        } else {
          const [lat, lng] = yandexCoords;
          const addr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setMapAddress(addr);
          onAddressChange(addr, null, null);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        const [lat, lng] = yandexCoords;
        const addr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setMapAddress(addr);
        onAddressChange(addr, null, null);
      } finally {
        setIsSearching(false);
      }
    },
    [apiKey, onAddressChange],
  );

  const handleMapClick = useCallback(
    (e: any) => {
      const clickedCoords = e.get("coords") as [number, number];
      setCoords(clickedCoords);

      // Convert to form format [lng, lat]
      const formCoords = convertFromYandexCoords(clickedCoords);
      onLocationChange(formCoords, mapAddress);
      getAddressFromMap(clickedCoords);
    },
    [getAddressFromMap, onLocationChange, mapAddress],
  );

  const handlePlacemarkDragEnd = useCallback(
    (e: any) => {
      const target = e.get("target");
      const newCoords = target.geometry.getCoordinates() as [number, number];
      setCoords(newCoords);

      // Convert to form format [lng, lat]
      const formCoords = convertFromYandexCoords(newCoords);
      onLocationChange(formCoords, mapAddress);
      getAddressFromMap(newCoords);
    },
    [getAddressFromMap, onLocationChange, mapAddress],
  );

  const locateMe = useCallback(() => {
    if (navigator.geolocation && isLoaded) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const yandexCoords: [number, number] = [lat, lng];

          setCoords(yandexCoords);

          if (mapRef.current) {
            mapRef.current.setCenter(yandexCoords);
            mapRef.current.setZoom(17);
          }

          // Convert to form format [lng, lat]
          const formCoords: [number, number] = [lng, lat];
          onLocationChange(formCoords, mapAddress);
          getAddressFromMap(yandexCoords);
        },
        () => {
          console.warn("Geolocation not available");
        },
      );
    }
  }, [isLoaded, getAddressFromMap, onLocationChange, mapAddress]);

  useEffect(() => {
    if (isLoaded && initialCoords && !hasInitialGeocoded.current) {
      const yandexCoords = convertToYandexCoords(initialCoords);
      getAddressFromMap(yandexCoords);
      hasInitialGeocoded.current = true;
    }
  }, [isLoaded, initialCoords, getAddressFromMap]);

  // Set map as loaded after a short delay to ensure it's rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Get map instance using instanceRef
  const handleMapInstance = useCallback((instance: any) => {
    if (instance) {
      mapRef.current = instance;
    }
  }, []);

  const handleAddressSearch = useCallback(async () => {
    if (!searchQuery.trim() || !apiKey) return;

    setIsTextSearching(true);
    try {
      const result = await geocodeAddressDetailed(searchQuery, apiKey);
      if (result) {
        const { coordinates, address, regionName, districtName } = result;
        const [lng, lat] = coordinates;
        const yandexCoords: [number, number] = [lat, lng];

        setCoords(yandexCoords);
        setMapAddress(address);

        if (mapRef.current) {
          mapRef.current.setCenter(yandexCoords);
          mapRef.current.setZoom(16);
        }

        onLocationChange(coordinates, address);
        onAddressChange(address, regionName, districtName);
      }
    } finally {
      setIsTextSearching(false);
    }
  }, [searchQuery, apiKey, onLocationChange, onAddressChange]);

  if (!apiKey) {
    return (
      <div>
        <Label className="mb-2 block">Xaritadan manzil tanlash</Label>
        <div className="relative h-[300px] w-full rounded-lg border border-border overflow-hidden flex items-center justify-center bg-gray-50">
          <p className="text-muted-foreground text-sm">
            Yandex Maps API kaliti sozlanmagan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Label className="mb-2 block">Xaritadan manzil tanlash</Label>

      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          placeholder="Manzil nomi bo'yicha qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddressSearch()}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddressSearch}
          disabled={isTextSearching || !searchQuery.trim()}
        >
          {isTextSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="relative h-[300px] w-full rounded-lg border border-border overflow-hidden">
        <YMaps query={{ apikey: apiKey, lang: "en_US" }}>
          <Map
            defaultState={mapState}
            width="100%"
            height="100%"
            onClick={handleMapClick}
            instanceRef={handleMapInstance}
            options={{
              suppressMapOpenBlock: true,
            }}
          >
            <Placemark
              geometry={coords}
              options={{
                preset: "islands#redIcon",
                draggable: true,
              }}
              onDragEnd={handlePlacemarkDragEnd}
            />
          </Map>
        </YMaps>

        {isSearching && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {isLoaded && (
          <>
            <button
              type="button"
              onClick={locateMe}
              className="absolute bottom-4 right-4 z-10 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
              title="Mening joylashuvim"
            >
              <Navigation size={20} className="text-primary" />
            </button>

            <div className="absolute top-4 left-4 z-10 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 text-xs text-muted-foreground shadow-md">
              <p>Xaritada bosing yoki marker'ni surib o'zgartiring</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
