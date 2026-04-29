"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instanceAuth } from "../api";
import {
  CartResponse,
  AddToCartRequest,
  RemoveFromCartRequest,
  UpdateCartRequest,
  SelectCartItemsRequest,
} from "@/types/api";
import { toast } from "react-hot-toast";
import { trackAddToCartConversion } from "@/lib/google-ads-conversion";

interface SuccessResponse {
  message: string;
  data?: unknown;
}

interface AddToCartConversionData {
  value: number;
  currency?: string;
  productId: string | number;
  productName?: string;
  quantity?: number;
}

type AddToCartMutationVariables = AddToCartRequest & {
  conversion?: AddToCartConversionData;
};

/**
 * Hook to get user's cart
 */
export function useCart(enabled: boolean = true) {
  return useQuery<CartResponse>({
    queryKey: ["/v1/cart"],
    queryFn: async () => {
      const { data } = await instanceAuth.get<CartResponse>("/v1/cart");
      return data;
    },
    enabled, // Only fetch when enabled (user is authenticated)
    retry: false,
  });
}

/**
 * Hook to add product to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, AddToCartMutationVariables>({
    mutationFn: async (payload: AddToCartMutationVariables) => {
      const cartPayload: AddToCartRequest = {
        id: payload.id,
        quantity: payload.quantity,
        variant: payload.variant,
        color: payload.color,
      };
      const { data } = await instanceAuth.post<SuccessResponse>(
        "/v1/cart/add",
        cartPayload
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ["/v1/cart"] });
      if (variables.conversion) {
        trackAddToCartConversion(variables.conversion);
      }
      toast.success("Mahsulot savatga qo'shildi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to remove product from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, RemoveFromCartRequest>({
    mutationFn: async (payload: RemoveFromCartRequest) => {
      const { data } = await instanceAuth.delete<SuccessResponse>(
        "/v1/cart/remove",
        { data: payload }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ["/v1/cart"] });
      toast.success("Mahsulot savatdan olib tashlandi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to update cart item quantity
 */
export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, UpdateCartRequest>({
    mutationFn: async (payload: UpdateCartRequest) => {
      const { data } = await instanceAuth.put<SuccessResponse>(
        "/v1/cart/update",
        payload
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ["/v1/cart"] });
      toast.success("Savat yangilandi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to select/unselect cart items
 */
export function useSelectCartItems() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, SelectCartItemsRequest>({
    mutationFn: async (payload: SelectCartItemsRequest) => {
      const { data } = await instanceAuth.post<SuccessResponse>(
        "/v1/cart/select-cart-items",
        payload
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ["/v1/cart"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}
