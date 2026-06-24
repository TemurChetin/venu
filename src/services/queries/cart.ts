"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instanceAuth } from "../api";
import { useGuestId } from "../guest-id";
import { queryGenerator } from "@/lib/query-generator";
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
 * Appends guest_id query param to a path when a guest id is available.
 * The cart works the same way for guests and logged-in users: it is always
 * keyed by guest_id. On login the backend merges the guest_id cart into the
 * user account, and instanceAuth additionally sends the auth token when present.
 */
function withGuestId(path: string, guestId: number | null): string {
  return guestId ? `${path}${queryGenerator({ guest_id: guestId })}` : path;
}

/**
 * Hook to get the cart (works for both guests and authenticated users)
 */
export function useCart() {
  const { guestId, isLoading: isLoadingGuestId } = useGuestId();

  return useQuery<CartResponse>({
    queryKey: ["/v1/cart", guestId],
    queryFn: async () => {
      const { data } = await instanceAuth.get<CartResponse>(
        withGuestId("/v1/cart", guestId)
      );
      return data;
    },
    enabled: !!guestId && !isLoadingGuestId,
    retry: false,
  });
}

/**
 * Hook to add product to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const { guestId } = useGuestId();

  return useMutation<SuccessResponse, Error, AddToCartMutationVariables>({
    mutationFn: async (payload: AddToCartMutationVariables) => {
      const cartPayload: AddToCartRequest = {
        id: payload.id,
        quantity: payload.quantity,
        variant: payload.variant,
        color: payload.color,
      };
      const { data } = await instanceAuth.post<SuccessResponse>(
        withGuestId("/v1/cart/add", guestId),
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
  const { guestId } = useGuestId();

  return useMutation<SuccessResponse, Error, RemoveFromCartRequest>({
    mutationFn: async (payload: RemoveFromCartRequest) => {
      const { data } = await instanceAuth.delete<SuccessResponse>(
        withGuestId("/v1/cart/remove", guestId),
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
  const { guestId } = useGuestId();

  return useMutation<SuccessResponse, Error, UpdateCartRequest>({
    mutationFn: async (payload: UpdateCartRequest) => {
      const { data } = await instanceAuth.put<SuccessResponse>(
        withGuestId("/v1/cart/update", guestId),
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
  const { guestId } = useGuestId();

  return useMutation<SuccessResponse, Error, SelectCartItemsRequest>({
    mutationFn: async (payload: SelectCartItemsRequest) => {
      const { data } = await instanceAuth.post<SuccessResponse>(
        withGuestId("/v1/cart/select-cart-items", guestId),
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
