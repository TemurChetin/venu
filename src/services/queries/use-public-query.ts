"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { instance } from "../api";
import { queryGenerator } from "@/lib/query-generator";
import { useGuestId } from "../guest-id";

interface UsePublicQueryOptions<T> {
  url: string;
  query?: Record<string, unknown>;
  data?: any;
  debounceTime?: number;
  enabled?: boolean;
  requiresGuestId?: boolean;
  queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;
  method?: "GET" | "POST";
}

/**
 * Generic hook for public API queries
 * - Handles URL parameter replacement
 * - Manages guest ID injection
 * - Supports debouncing
 * - Handles retry logic
 */
export function usePublicQuery<T>({
  url,
  query = {},
  data, // for POST requests
  debounceTime,
  enabled = true,
  requiresGuestId = true,
  queryOptions,
  method = "GET",
}: UsePublicQueryOptions<T>) {
  const params = useParams();
  const { guestID, isLoading: isLoadingGuestId } = useGuestId();

  // Replace URL parameters from Next.js route params
  let finalUrl = url;
  Object.keys(params).forEach((key) => {
    const regex = new RegExp(`\\[${key}\\]`, "g");
    const value = Array.isArray(params[key]) ? params[key]?.[0] : params[key];

    if (value !== undefined) {
      finalUrl = finalUrl.replace(regex, String(value));
    }
  });

  // Add guest ID to query if required
  const finalQuery = { ...query };
  if (requiresGuestId && guestID) {
    finalQuery.guest_id = guestID;
  }

  // Build query string
  if (Object.keys(finalQuery).length > 0) {
    finalUrl += queryGenerator(finalQuery);
  }

  // Include data in query key for POST requests to ensure refetch when data changes
  const queryKey = method === "POST" && data ? [finalUrl, data] : [finalUrl];

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const apiUrl = finalUrl.startsWith("/api")
          ? finalUrl
          : `/api${finalUrl}`;

        const { data: responseData } = await instance.request<T>({
          method,
          url: apiUrl,
          data: data || undefined,
        });

        return responseData;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("React Query Error:", {
            url: finalUrl,
            error,
          });
        }
        throw error;
      }
    },
    enabled: enabled && (!requiresGuestId || !isLoadingGuestId),
    retry: (failureCount, error) => {
      // Don't retry on client errors
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status: number }).status;
        if ([401, 403, 404].includes(status)) {
          return false;
        }
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...queryOptions,
  });
}
