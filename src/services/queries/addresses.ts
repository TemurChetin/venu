"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceAuth } from "../api";
import { toast } from "react-hot-toast";

interface SuccessResponse {
  message: string;
  data?: any;
}

export interface AddAddressRequest {
  address_type: "home" | "office" | "other";
  address: string;
  city?: string;
  country?: string;
  zip?: string;
  contact_person_name: string;
  contact_person_number: string;
  phone: string;
  region_id: number;
  district_id: number;
  is_billing?: boolean;
  latitude?: number;
  longitude?: number;
}

/**
 * Hook to add a new address
 */
export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, AddAddressRequest>({
    mutationFn: async (payload: AddAddressRequest) => {
      const { data } = await instanceAuth.post<SuccessResponse>(
        "/v1/customer/address/add",
        payload
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate addresses query to refetch
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === "string" && key.includes("address/list");
        },
      });
      toast.success("Manzil muvaffaqiyatli qo'shildi");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        "Manzil qo'shishda xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });
}

