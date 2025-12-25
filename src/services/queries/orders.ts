"use client";

import { useQuery } from "@tanstack/react-query";
import { instanceAuth } from "../api";
import { OrdersResponse } from "@/types/api";

export interface UseOrdersParams {
  limit?: number;
  offset?: number;
  status?: "pending" | "confirmed" | "processing" | "processed" | "delivered" | "failed" | "returned" | "canceled" | "out_for_delivery";
}

/**
 * Hook to get user's orders
 */
export function useOrders(params: UseOrdersParams = {}) {
  const { limit = 10, offset = 0, status } = params;

  return useQuery<OrdersResponse>({
    queryKey: ["/v1/customer/order/list", { limit, offset, status }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit.toString());
      queryParams.append("offset", offset.toString());
      if (status) {
        queryParams.append("status", status);
      }

      const { data } = await instanceAuth.get<OrdersResponse>(
        `/v1/customer/order/list?${queryParams.toString()}`
      );
      return data;
    },
    retry: false,
  });
}

