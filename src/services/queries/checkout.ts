"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
 * Uses guest_id for public API access
 */
export function useAddresses() {
  return usePublicQuery<AddressesResponse>({
    url: "/api/v1/customer/address/list",
    requiresGuestId: true,
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
      // Redirect to payment page
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
