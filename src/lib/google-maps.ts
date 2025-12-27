/**
 * Google Maps React Integration
 * This module provides React components and utilities for Google Maps API
 */

import { useCallback } from "react";

/**
 * Geocode coordinates to address using Google Geocoding API
 */
export async function geocodeCoordinates(
  coords: [number, number],
  apiKey: string
): Promise<string | null> {
  try {
    const [lng, lat] = coords;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=uz`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      // Return the formatted address
      return data.results[0].formatted_address;
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Geocode address string to coordinates using Google Geocoding API
 */
export async function geocodeAddress(
  address: string,
  apiKey: string
): Promise<{ coordinates: [number, number]; address: string } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}&language=uz`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      const coordinates: [number, number] = [location.lng, location.lat];

      return {
        coordinates,
        address: result.formatted_address,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

