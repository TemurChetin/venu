"use client";

import { useState, useEffect } from "react";
import { getGuestIdFromStorage } from "@/lib/storage/guest-id";
import { fetchGuestId } from "./guest-id-manager";

/**
 * Hook to manage guest ID state
 * - Checks localStorage first for immediate availability
 * - Fetches from API if not available
 * - Prevents multiple simultaneous fetches
 */
export function useGuestId() {
  const [guestId, setGuestId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      return getGuestIdFromStorage();
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !getGuestIdFromStorage();
    }
    return true;
  });

  useEffect(() => {
    // If guest ID is already available, no need to fetch
    if (guestId || typeof window === "undefined") {
      return;
    }

    // Fetch guest ID
    fetchGuestId()
      .then((newGuestId) => {
        setGuestId(newGuestId);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [guestId]);

  return { guestId, isLoading };
}
