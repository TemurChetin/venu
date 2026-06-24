"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { instanceAuth } from "../api";
import { Product, WishlistResponse } from "@/types/api";
import { toast } from "react-hot-toast";
import {
  getGuestWishlist,
  addToGuestWishlist,
  removeFromGuestWishlist,
} from "@/lib/storage/guest-wishlist";

interface SuccessResponse {
  message: string;
  data?: any;
}

const BACKEND_KEY = ["/v1/customer/wish-list"];
const GUEST_KEY = ["guest-wishlist"];

function invalidateWishlist(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: BACKEND_KEY });
  queryClient.invalidateQueries({ queryKey: GUEST_KEY });
}

/**
 * Hook to get the wishlist.
 * - Logged in: reads from the backend.
 * - Guest: reads from localStorage.
 */
export function useWishlist() {
  const { data: session } = useSession();

  return useQuery<WishlistResponse>({
    queryKey: session ? BACKEND_KEY : GUEST_KEY,
    queryFn: async () => {
      if (session) {
        const { data } = await instanceAuth.get<WishlistResponse>(
          "/v1/customer/wish-list"
        );
        return data;
      }
      return getGuestWishlist();
    },
    retry: false,
  });
}

/**
 * Hook to check if a product is in wishlist
 */
export function useWishlistStatus(productId: number) {
  const { data: wishlistData } = useWishlist();

  const isWishlisted =
    wishlistData?.some((product) => product.product_id === productId) ?? false;

  return { isWishlisted, wishlistData };
}

/**
 * Hook to add product to wishlist.
 * - Logged in: persists to the backend.
 * - Guest: persists to localStorage (synced to the backend after login).
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<SuccessResponse | void, Error, Product>({
    mutationFn: async (product: Product) => {
      if (session) {
        const { data } = await instanceAuth.post<SuccessResponse>(
          `/v1/customer/wish-list/add?product_id=${product.id}`
        );
        return data;
      }
      addToGuestWishlist(product);
    },
    onSuccess: () => {
      invalidateWishlist(queryClient);
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
 * Hook to remove product from wishlist.
 * - Logged in: removes on the backend.
 * - Guest: removes from localStorage.
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<SuccessResponse | void, Error, number>({
    mutationFn: async (productId: number) => {
      if (session) {
        const { data } = await instanceAuth.delete<SuccessResponse>(
          `/v1/customer/wish-list/remove?product_id=${productId}`
        );
        return data;
      }
      removeFromGuestWishlist(productId);
    },
    onSuccess: () => {
      invalidateWishlist(queryClient);
      toast.success("Sevimlilar ro'yxatidan olib tashlandi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}
