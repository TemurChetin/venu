"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import {
  MapPin,
  Navigation,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

declare global {
  interface Window {
    ymaps: any;
  }
}

const TASHKENT_CENTER = [41.2995, 69.2401];

export default function DeliveryMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const [address, setAddress] = useState<string>("Manzilni tanlang...");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [coords, setCoords] = useState<number[]>(TASHKENT_CENTER);

  // 1. Manzilni olish (Reverse Geocoding)
  const getAddress = useCallback((coords: number[]) => {
    if (!window.ymaps) return;

    setIsSearching(true);
    window.ymaps
      .geocode(coords)
      .then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0);
        const addr = firstGeoObject
          ? firstGeoObject.getAddressLine()
          : "Noma'lum hudud";
        setAddress(addr);
        setIsSearching(false);
      })
      .catch(() => {
        setIsSearching(false);
      });
  }, []);

  // 2. Xarita yuklangandan keyin ishga tushadigan asosiy funksiya
  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;

    window.ymaps.ready(() => {
      mapInstance.current = new window.ymaps.Map(
        mapRef.current,
        {
          center: TASHKENT_CENTER,
          zoom: 16, // Zoom to'g'rilandi (Yandexda max 19 gacha)
          controls: ["zoomControl"],
        },
        {
          suppressMapOpenBlock: true,
          yandexMapDisablePoiInteractivity: true,
        }
      );

      // Xarita harakati to'xtaganda markaziy nuqtadan manzil olish
      mapInstance.current.events.add("actionend", () => {
        const newCenter = mapInstance.current.getCenter();
        setCoords(newCenter);
        getAddress(newCenter);
      });

      // Qidiruv suggestini xavfsiz qo'shish
      try {
        if (window.ymaps.SuggestView) {
          const suggestView = new window.ymaps.SuggestView("suggest-input");
          suggestView.events.add("select", (e: any) => {
            const selectedValue = e.get("item").value;
            setSearchQuery(selectedValue);
            window.ymaps.geocode(selectedValue).then((res: any) => {
              const newCoords = res.geoObjects.get(0).geometry.getCoordinates();
              mapInstance.current.setCenter(newCoords, 17, { duration: 400 });
            });
          });
        }
      } catch (err) {
        console.warn("Qidiruv takliflari moduli yuklanmadi.");
      }

      getAddress(TASHKENT_CENTER);
      setIsLoading(false);
    });
  };

  // 3. Foydalanuvchi joylashgan joyini aniqlash
  const locateMe = () => {
    if (navigator.geolocation && mapInstance.current) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userCoords = [pos.coords.latitude, pos.coords.longitude];
        mapInstance.current.setCenter(userCoords, 17, { duration: 500 });
      });
    }
  };

  useEffect(() => {
    console.log(coords);
    console.log(address);
  }, [coords]);

  return (
    <>
      {/* Yandex Script - Preload muammosini hal qiladi */}
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=2abfe0ab-2d42-40c3-afad-e74cb318f0d6&lang=uz_UZ"
        onLoad={initMap}
      />

      <Card className="overflow-hidden">
        {/* Header & Search */}
        <CardHeader className="space-y-4">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Yetkazib berish manzili
          </h2>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              id="suggest-input"
              type="text"
              placeholder="Shahar, ko'cha yoki uy raqami..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        {/* Map Container */}
        <CardContent className="relative h-[400px] w-full">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {/* Markazda qotirilgan Marker (Pin) */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            <div className="relative mb-12 flex flex-col items-center">
              <div className="bg-primary p-2.5 rounded-full shadow-2xl border-4 border-white animate-bounce-slow">
                <MapPin size={30} className="text-white fill-white" />
              </div>
              <div className="w-2 h-2 bg-black/20 rounded-full blur-[2px] mt-1"></div>
            </div>
          </div>

          <div
            ref={mapRef}
            className="w-full h-full rounded-3xl overflow-hidden"
          />

          {/* Joylashuvni aniqlash tugmasi */}
          <button
            onClick={locateMe}
            className="absolute bottom-6 right-6 z-10 p-4 bg-white rounded-2xl shadow-xl hover:bg-gray-50 active:scale-90 transition-all border border-gray-100 text-primary"
            title="Mening joylashuvim"
            type="button"
          >
            <Navigation size={22} />
          </button>
        </CardContent>

        {/* Address Info & Footer */}
        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-start gap-4 mb-6 min-h-[60px]">
            <div
              className={`mt-1 p-2.5 rounded-xl ${
                isSearching ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              {isSearching ? (
                <Loader2 size={20} className="text-primary animate-spin" />
              ) : (
                <CheckCircle2 size={20} className="text-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">
                Tanlangan manzil
              </p>
              <p className="text-base font-bold text-gray-800 leading-tight">
                {isSearching ? "Manzil aniqlanmoqda..." : address}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSearching || isLoading}
            className="w-full py-5 bg-primary hover:bg-primary/90 disabled:bg-gray-200 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Shu yerga yetkazish
          </button>
        </CardFooter>
      </Card>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        /* Yandex suggest ro'yxatini chiroyli qilish */
        .ymaps-2-1-79-suggest-item {
          padding: 12px !important;
          font-family: inherit !important;
          font-size: 14px !important;
        }
      `}</style>
    </>
  );
}
