"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { instanceAuth, instance } from "../api";
import { usePublicQuery } from "./use-public-query";
import { useGuestId } from "../guest-id";
import { queryGenerator } from "@/lib/query-generator";
import {
  AddressesResponse,
  DeliveryMethodsResponse,
  CalculateDeliveryRequest,
  CalculateDeliveryResponse,
  ChooseShippingMethodRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  CartResponse,
} from "@/types/api";
import { toast } from "react-hot-toast";

interface SuccessResponse {
  message: string;
  data?: any;
}

/**
 * Hook to get cart with guest_id support (for checkout)
 */
export function useCartForCheckout() {
  const { guestId, isLoading: isLoadingGuestId } = useGuestId();

  return useQuery<CartResponse>({
    queryKey: ["/api/v1/cart", guestId],
    queryFn: async () => {
      const url = `/api/v1/cart${queryGenerator({ guest_id: guestId! })}`;
      const { data } = await instance.get<CartResponse>(url);
      return data;
    },
    enabled: !!guestId && !isLoadingGuestId,
    retry: false,
  });
}

/**
 * Hook to get user's addresses
 * Uses authenticated request with session token and guest_id
 */
export function useAddresses() {
  const { data: session } = useSession();
  const { guestId, isLoading: isLoadingGuestId } = useGuestId();

  return useQuery<AddressesResponse>({
    queryKey: ["/v1/customer/address/list", guestId, session?.user?.id],
    queryFn: async () => {
      // Build URL with guest_id query parameter
      let url = "/v1/customer/address/list";
      if (guestId) {
        url += queryGenerator({ guest_id: guestId });
      }

      // instanceAuth automatically adds Authorization header from session
      const { data } = await instanceAuth.get<AddressesResponse>(url);
      return data;
    },
    enabled: (!isLoadingGuestId && !!guestId) || !!session, // Enable if guest_id is loaded or user is authenticated
    retry: false,
  });
}

/**
 * Hook to get delivery methods for a region
 */
export function useDeliveryMethods(regionId: number | null) {
  return usePublicQuery<DeliveryMethodsResponse>({
    url: "/api/v1/delivery-methods",
    query: regionId ? { region_id: regionId } : {},
    enabled: !!regionId,
    requiresGuestId: false,
  });
}

/**
 * Hook to choose shipping method for order
 */
export function useChooseShippingMethod() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, ChooseShippingMethodRequest>({
    mutationFn: async (payload: ChooseShippingMethodRequest) => {
      const { data } = await instanceAuth.post<SuccessResponse>(
        "/v1/shipping-method/choose-for-order",
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Yetkazib berish metodi tanlandi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to calculate delivery cost
 */
export function useCalculateDelivery() {
  return useMutation<
    CalculateDeliveryResponse,
    Error,
    CalculateDeliveryRequest
  >({
    mutationFn: async (payload: CalculateDeliveryRequest) => {
      const { data } = await instance.post<CalculateDeliveryResponse>(
        "/api/v1/calculate",
        payload
      );
      return data;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        "Yetkazib berish narxini hisoblashda xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to create order
 */
export function useCreateOrder() {
  return useMutation<CreateOrderResponse, Error, CreateOrderRequest>({
    mutationFn: async (payload: CreateOrderRequest) => {
      const { data } = await instanceAuth.post<CreateOrderResponse>(
        "/v1/digital-payment",
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      window.gtag?.("event", "conversion", {
        send_to: "AW-18083229657/ZJZHCMqv758cENnf4K5D",
        value: 1.0,
        currency: "USD",
        transaction_id: "",
      });
      if (data.redirect_link) {
        window.location.href = data.redirect_link;
      } else {
        toast.success("Buyurtma muvaffaqiyatli yaratildi");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        "Buyurtma yaratishda xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}
