"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instanceAuth } from "../api";
import { Product, WishlistResponse } from "@/types/api";
import { toast } from "react-hot-toast";

interface SuccessResponse {
  message: string;
  data?: any;
}

/**
 * Hook to get user's wishlist
 */
export function useWishlist(enabled: boolean = true) {
  return useQuery<WishlistResponse>({
    queryKey: ["/v1/customer/wish-list"],
    queryFn: async () => {
      const { data } = await instanceAuth.get<WishlistResponse>(
        "/v1/customer/wish-list"
      );
      return data;
    },
    enabled, // Only fetch when enabled (user is authenticated)
    retry: false,
  });
}

/**
 * Hook to check if a product is in wishlist
 */
export function useWishlistStatus(productId: number) {
  const { data: wishlistData } = useWishlist();

  const isWishlisted =
    wishlistData?.some((product) => product.id === productId) ?? false;

  return { isWishlisted, wishlistData };
}

/**
 * Hook to add product to wishlist
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, number>({
    mutationFn: async (productId: number) => {
      const { data } = await instanceAuth.post<SuccessResponse>(
        `/v1/customer/wish-list/add?product_id=${productId}`
      );
      return data;
    },
    onSuccess: (data, productId) => {
      // Invalidate wishlist query to refetch
      queryClient.invalidateQueries({ queryKey: ["/v1/customer/wish-list"] });
      toast.success("Sevimlilar ro'yxatiga qo'shildi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to remove product from wishlist
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, number>({
    mutationFn: async (productId: number) => {
      const { data } = await instanceAuth.delete<SuccessResponse>(
        `/v1/customer/wish-list/remove?product_id=${productId}`
      );
      return data;
    },
    onSuccess: (data, productId) => {
      // Invalidate wishlist query to refetch
      queryClient.invalidateQueries({ queryKey: ["/v1/customer/wish-list"] });
      toast.success("Sevimlilar ro'yxatidan olib tashlandi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}
