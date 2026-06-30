"use client";

import { useEffect, useState } from "react";
import type { Address } from "@/types/api";

/**
 * Manzil tanlovi: selectedAddressId state + birinchi manzilni avto-tanlash.
 */
export function useCheckoutAddress(addresses: Address[] | undefined) {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const selectedAddress = addresses?.find((a) => a.id === selectedAddressId);

  // Auto-select first address
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  return { selectedAddressId, setSelectedAddressId, selectedAddress };
}
