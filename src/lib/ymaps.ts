/**
 * Yandex Maps v3 React Integration
 * This module provides React components for Yandex Maps API v3
 */

import { useEffect, useState, useRef } from "react";
import React from "react";
import ReactDOM from "react-dom";

declare global {
  interface Window {
    ymaps?: {
      geocode: (
        request: string | number[],
        options?: Record<string, unknown>
      ) => Promise<{
        geoObjects?: {
          get?: (index: number) => {
            getAddressLine?: () => string;
            properties?: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              get?: (key: string) => any;
            };
          } | null;
        };
      }>;
    };
    ymaps3: any;
  }
}

interface YandexMapsLoader {
  isLoaded: boolean;
  isReady: boolean;
  error: Error | null;
  YMap: any;
  YMapDefaultSchemeLayer: any;
  YMapDefaultFeaturesLayer: any;
  YMapMarker: any;
  YMapZoomControl: any;
  YMapGeolocationControl: any;
  reactify: any;
  ymaps3: any;
}

let mapsCache: YandexMapsLoader | null = null;
let loadPromise: Promise<YandexMapsLoader> | null = null;

export interface GeocodedLocation {
  address: string | null;
  regionName: string | null;
  districtName: string | null;
}

async function reverseGeocodeWithJsApi(
  coords: [number, number]
): Promise<string | null> {
  if (typeof window === "undefined" || !window.ymaps?.geocode) {
    return null;
  }

  try {
    const result = await window.ymaps.geocode([coords[1], coords[0]], {
      kind: "house",
      results: 1,
    });
    const firstGeoObject = result?.geoObjects?.get?.(0);

    return (
      firstGeoObject?.getAddressLine?.() ||
      firstGeoObject?.properties?.get?.("text") ||
      null
    );
  } catch {
    return null;
  }
}

async function reverseGeocodeDetailedWithJsApi(
  coords: [number, number]
): Promise<GeocodedLocation | null> {
  if (typeof window === "undefined" || !window.ymaps?.geocode) return null;

  try {
    const [lng, lat] = coords;
    const result = await window.ymaps.geocode([lat, lng], { results: 1 });
    const firstGeoObject = result?.geoObjects?.get?.(0);
    if (!firstGeoObject) return null;

    const address =
      firstGeoObject.getAddressLine?.() ||
      firstGeoObject.properties?.get?.("text") ||
      null;

    const meta = firstGeoObject.properties?.get?.("metaDataProperty");
    const components: Array<{ kind: string; name: string }> =
      meta?.GeocoderMetaData?.Address?.Components || [];

    const regionName = components.find((c) => c.kind === "province")?.name || null;
    const districtName =
      components.find((c) => c.kind === "district")?.name ||
      components.find((c) => c.kind === "locality")?.name ||
      null;

    return { address, regionName, districtName };
  } catch {
    return null;
  }
}

/**
 * Load Yandex Maps v3 API and React components
 */
export async function loadYandexMaps(apiKey: string): Promise<YandexMapsLoader> {
  // Return cached instance if already loaded
  if (mapsCache && mapsCache.isReady) {
    return mapsCache;
  }

  // Return existing promise if loading
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Check if script is already in DOM
    const existingScript = document.querySelector(
      'script[src*="api-maps.yandex.ru/v3"]'
    );

    const initMaps = async () => {
      try {
        // Wait for ymaps3 to be available
        while (!window.ymaps3) {
          await new Promise((r) => setTimeout(r, 100));
        }

        // Wait for ymaps3.ready
        await window.ymaps3.ready;

        // Import reactify module
        const ymaps3React = await window.ymaps3.import("@yandex/ymaps3-reactify");

        // Create reactify instance
        const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

        // Get React components
        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapMarker,
          YMapZoomControl,
          YMapGeolocationControl,
        } = reactify.module(window.ymaps3);

        mapsCache = {
          isLoaded: true,
          isReady: true,
          error: null,
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapMarker,
          YMapZoomControl,
          YMapGeolocationControl,
          reactify,
          ymaps3: window.ymaps3,
        };

        resolve(mapsCache);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        reject(err);
      }
    };

    if (existingScript) {
      // Script already exists, just initialize
      initMaps().catch(reject);
    } else {
      // Create and load script
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=uz_UZ`;
      script.async = true;

      script.onload = () => {
        initMaps().catch(reject);
      };

      script.onerror = () => {
        reject(new Error("Failed to load Yandex Maps script"));
      };

      document.head.appendChild(script);
    }
  });

  return loadPromise;
}

/**
 * React hook to use Yandex Maps v3 components
 */
export function useYandexMaps(apiKey: string) {
  const [loader, setLoader] = useState<YandexMapsLoader | null>(
    mapsCache?.isReady ? mapsCache : null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!mapsCache?.isReady);

  useEffect(() => {
    if (mapsCache?.isReady) {
      setLoader(mapsCache);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    loadYandexMaps(apiKey)
      .then((loaded) => {
        setLoader(loaded);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });
  }, [apiKey]);

  return { loader, isLoading, error };
}

/**
 * Geocode coordinates to address using Yandex Geocoding API
 */
export async function geocodeCoordinates(
  coords: [number, number],
  apiKey: string
): Promise<string | null> {
  const jsApiAddress = await reverseGeocodeWithJsApi(coords);
  if (jsApiAddress) {
    return jsApiAddress;
  }

  try {
    const [lng, lat] = coords;
    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${lng},${lat}&format=json&lang=uz_UZ`
    );

    if (!response.ok) {
      if (response.status === 403) {
        return null;
      }

      throw new Error("Geocoding request failed");
    }

    const data = await response.json();
    const geoObject =
      data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

    if (geoObject) {
      return geoObject.metaDataProperty?.GeocoderMetaData?.text || null;
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Geocode coordinates and extract region/district components.
 * Tries Yandex JS API first (loaded on page, no CORS/auth issues),
 * then falls back to HTTP Geocoding API.
 */
export async function geocodeCoordinatesDetailed(
  coords: [number, number],
  apiKey: string
): Promise<GeocodedLocation> {
  const empty: GeocodedLocation = { address: null, regionName: null, districtName: null };

  // JS API is more reliable — no CORS issues, uses the already-loaded Yandex script
  const jsResult = await reverseGeocodeDetailedWithJsApi(coords);
  if (jsResult) return jsResult;

  // HTTP API fallback
  const [lng, lat] = coords;
  try {
    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${lng},${lat}&format=json&lang=uz_UZ&results=1`
    );
    if (!response.ok) return empty;

    const data = await response.json();
    const geoObject =
      data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
    if (!geoObject) return empty;

    const address: string | null =
      geoObject.metaDataProperty?.GeocoderMetaData?.text || null;

    const components: Array<{ kind: string; name: string }> =
      geoObject.metaDataProperty?.GeocoderMetaData?.Address?.Components || [];

    const regionName = components.find((c) => c.kind === "province")?.name || null;
    const districtName =
      components.find((c) => c.kind === "district")?.name ||
      components.find((c) => c.kind === "locality")?.name ||
      null;

    return { address, regionName, districtName };
  } catch {
    return empty;
  }
}

/**
 * Geocode address string to coordinates using Yandex Geocoding API
 */
export async function geocodeAddress(
  address: string,
  apiKey: string
): Promise<{ coordinates: [number, number]; address: string } | null> {
  try {
    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encodeURIComponent(
        address
      )}&format=json&lang=uz_UZ`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();
    const geoObject =
      data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

    if (geoObject) {
      const [lng, lat] = geoObject.Point.pos.split(" ").map(Number);
      const address = geoObject.metaDataProperty?.GeocoderMetaData?.text || "";

      return {
        coordinates: [lng, lat] as [number, number],
        address,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Export types
export type { YandexMapsLoader };
