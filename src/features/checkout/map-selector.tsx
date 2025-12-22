"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MapSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  className?: string;
}

export function MapSelector({ onLocationSelect, className }: MapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 41.2995,
    lng: 69.2401,
  }); // Tashkent

  const handleSearch = () => {
    // Mock search - in real app, use geocoding API
    console.log("[v0] Searching for:", searchQuery);
  };

  const handleMapClick = () => {
    // Mock location selection
    const mockLocation = {
      lat: 41.2995 + (Math.random() - 0.5) * 0.1,
      lng: 69.2401 + (Math.random() - 0.5) * 0.1,
    };
    setSelectedLocation(mockLocation);
    onLocationSelect(mockLocation);
  };

  return (
    <div className={className}>
      <div className="mb-2 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Manzilni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="button" onClick={handleSearch} variant="outline">
          Qidirish
        </Button>
      </div>

      {/* Mock Map - In real app, integrate Yandex Maps or Google Maps */}
      <div
        onClick={handleMapClick}
        className="relative h-64 cursor-crosshair overflow-hidden rounded-lg border-2 border-border bg-gradient-to-br from-green-50 to-blue-50"
      >
        <div className="absolute inset-0 bg-[url('/map-pattern.png')] opacity-20" />

        {/* Selected location marker */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
          style={{
            transform: `translate(-50%, -100%)`,
          }}
        >
          <MapPin
            className="h-8 w-8 text-primary drop-shadow-lg"
            fill="currentColor"
          />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Manzilni tanlash uchun bosing</span>
          </div>
        </div>

        {/* Mock map controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-8 w-8"
          >
            +
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-8 w-8"
          >
            −
          </Button>
        </div>
      </div>

      {selectedLocation && (
        <p className="mt-2 text-sm text-muted-foreground">
          Tanlangan joylashuv: {selectedLocation.lat.toFixed(4)},{" "}
          {selectedLocation.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
