/**
 * Guest ID Management Service
 * Handles fetching and storing guest ID for anonymous users
 */

import { instance } from "../api/instance";
import {
  getGuestIdFromStorage,
  saveGuestIdToStorage,
} from "@/lib/storage/guest-id";
import type { GuestIdResponse } from "@/types/api";

// Module-level variable to prevent multiple simultaneous API calls
let guestIdFetchPromise: Promise<number> | null = null;

/**
 * Fetches a new guest ID from the API
 * Uses a singleton pattern to prevent multiple simultaneous requests
 */
export async function fetchGuestId(): Promise<number> {
  // If a fetch is already in progress, return that promise
  if (guestIdFetchPromise) {
    return guestIdFetchPromise;
  }

  // Start new fetch
  guestIdFetchPromise = instance
    .request<GuestIdResponse>({
      method: "GET",
      url: "/api/v1/get-guest-id",
    })
    .then(({ data }) => {
      const newGuestId = data.guest_id;

      if (newGuestId) {
        saveGuestIdToStorage(newGuestId);
        guestIdFetchPromise = null; // Reset promise after success
        return newGuestId;
      }

      throw new Error("No guest_id in response");
    })
    .catch((error) => {
      guestIdFetchPromise = null; // Reset promise on error
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching guestId:", error);
      }
      throw error;
    });

  return guestIdFetchPromise;
}

/**
 * Gets guest ID from storage or fetches a new one
 */
export async function getOrFetchGuestId(): Promise<number | null> {
  if (typeof window === "undefined") return null;

  // Try to get from storage first
  const storedGuestId = getGuestIdFromStorage();
  if (storedGuestId !== null) {
    return storedGuestId;
  }

  // Fetch new guest ID
  try {
    return await fetchGuestId();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch guest ID:", error);
    }
    return null;
  }
}
