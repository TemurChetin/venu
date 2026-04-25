"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
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
import { trackPurchaseConversion } from "@/lib/google-ads-conversion";

interface SuccessResponse {
  message: string;
  data?: unknown;
}

interface ApiError {
  response?: {
    data?: {
      errors?: Array<{ message?: string }>;
      message?: string;
    };
  };
}

interface PurchaseConversionData {
  value: number;
  currency: string;
  transactionId: string;
}

interface CreateOrderMutationVariables {
  order: CreateOrderRequest;
  conversion: PurchaseConversionData;
}

function extractTransactionId(data: CreateOrderResponse) {
  return (
    data.order_id ||
    data.id ||
    data.order?.id ||
    data.data?.order_id ||
    data.data?.id ||
    data.data?.order?.id
  );
}

function extractRedirectLink(data: CreateOrderResponse) {
  return data.redirect_link || data.data?.redirect_link;
}

function extractNewCustomer(data: CreateOrderResponse) {
  const newUser = data.new_user ?? data.data?.new_user;

  if (typeof newUser === "boolean") {
    return newUser;
  }

  if (typeof newUser === "number") {
    return newUser === 1;
  }

  return undefined;
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiError;

  return (
    apiError.response?.data?.errors?.[0]?.message ||
    apiError.response?.data?.message ||
    fallback
  );
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Xatolik yuz berdi"));
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
    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Yetkazib berish narxini hisoblashda xatolik yuz berdi"
        )
      );
    },
  });
}

/**
 * Hook to create order
 */
export function useCreateOrder() {
  return useMutation<CreateOrderResponse, Error, CreateOrderMutationVariables>({
    mutationFn: async ({ order }: CreateOrderMutationVariables) => {
      const { data } = await instanceAuth.post<CreateOrderResponse>(
        "/v1/digital-payment",
        order
      );
      return data;
    },
    onSuccess: (data, variables) => {
      trackPurchaseConversion({
        value: variables.conversion.value,
        currency: variables.conversion.currency,
        transactionId:
          extractTransactionId(data) || variables.conversion.transactionId,
        newCustomer: extractNewCustomer(data),
      });

      const redirectLink = extractRedirectLink(data);
      if (redirectLink) {
        window.location.href = redirectLink;
      } else {
        toast.success("Buyurtma muvaffaqiyatli yaratildi");
      }
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, "Buyurtma yaratishda xatolik yuz berdi")
      );
    },
  });
}
