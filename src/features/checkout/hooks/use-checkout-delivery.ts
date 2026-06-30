"use client";

import { useEffect, useRef, useState } from "react";
import { useCalculateDelivery } from "@/services/queries/checkout";
import type { Address, DeliveryMethod } from "@/types/api";
import type { DeliveryMethodCode } from "../types/checkout.types";

interface UseCheckoutDeliveryParams {
  selectedAddress: Address | undefined;
  deliveryMethods: DeliveryMethod[] | undefined;
  isFreeDeliveryEligible: boolean;
  sessionUserId: string | undefined;
}

/**
 * Yetkazib berish: metod tanlovi + narx hisobi.
 * - Manzil o'zgarganda metodni avto-tanlash.
 * - Manzil/metod tanlanganda narxni hisoblash (oldingi qiymatlar bilan dedupe).
 */
export function useCheckoutDelivery({
  selectedAddress,
  deliveryMethods,
  isFreeDeliveryEligible,
  sessionUserId,
}: UseCheckoutDeliveryParams) {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<DeliveryMethodCode | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const calculateDelivery = useCalculateDelivery();

  // Auto-select delivery method when address changes
  useEffect(() => {
    if (selectedAddress && deliveryMethods && deliveryMethods.length > 0) {
      // Prefer the address's delivery method, or use the first available
      const preferredMethod = selectedAddress.delivery_method;
      const methodExists = deliveryMethods.some(
        (m) => m.code === preferredMethod,
      );
      if (methodExists) {
        setSelectedDeliveryMethod(preferredMethod as DeliveryMethodCode);
      } else {
        setSelectedDeliveryMethod(deliveryMethods[0].code as DeliveryMethodCode);
      }
    }
  }, [selectedAddress, deliveryMethods]);

  // Track previous values to prevent unnecessary recalculations
  const prevCalcParamsRef = useRef<{
    addressId?: number;
    deliveryMethod?: string | null;
    isFreeEligible?: boolean;
  }>({});

  // Calculate delivery cost when address and delivery method are selected
  useEffect(() => {
    const addressId = selectedAddress?.id;
    const deliveryMethod = selectedDeliveryMethod;
    const isFreeEligible = isFreeDeliveryEligible;

    // Skip if values haven't changed
    const prev = prevCalcParamsRef.current;
    if (
      prev.addressId === addressId &&
      prev.deliveryMethod === deliveryMethod &&
      prev.isFreeEligible === isFreeEligible
    ) {
      return;
    }

    prevCalcParamsRef.current = { addressId, deliveryMethod, isFreeEligible };

    if (
      selectedAddress &&
      deliveryMethod &&
      deliveryMethod !== "free" &&
      !isFreeEligible
    ) {
      const customerId = sessionUserId ? parseInt(sessionUserId, 10) : null;

      if (customerId) {
        calculateDelivery.mutate(
          {
            delivery_method: deliveryMethod,
            customer_id: customerId,
            long: parseFloat(selectedAddress.longitude),
            lat: parseFloat(selectedAddress.latitude),
            district: selectedAddress.district_id.toString(),
          },
          {
            onSuccess: (data) => {
              setDeliveryCost(data.price);
            },
            onError: () => {
              setDeliveryCost(null);
            },
          },
        );
      }
    } else if (deliveryMethod === "free" || isFreeEligible) {
      setDeliveryCost(0);
    }
  }, [
    selectedAddress?.id,
    selectedAddress?.longitude,
    selectedAddress?.latitude,
    selectedAddress?.district_id,
    selectedDeliveryMethod,
    isFreeDeliveryEligible,
    sessionUserId,
  ]);

  const handleDeliveryMethodChange = (value: string) => {
    setSelectedDeliveryMethod(value as DeliveryMethodCode);
    if (value !== "free" && !isFreeDeliveryEligible) {
      // Reset delivery cost to recalculate
      setDeliveryCost(null);
    }
  };

  return {
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    deliveryCost,
    handleDeliveryMethodChange,
  };
}
