"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instanceAuth } from "../api";
import { CartResponse, AddToCartRequest, RemoveFromCartRequest, UpdateCartRequest } from "@/types/api";
import { toast } from "react-hot-toast";

interface SuccessResponse {
  message: string;
  data?: any;
}

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

  return useMutation<SuccessResponse, Error, AddToCartRequest>({
    mutationFn: async (payload: AddToCartRequest) => {
      const { data } = await instanceAuth.post<SuccessResponse>(
        "/v1/cart/add",
        payload
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ["/v1/cart"] });
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

