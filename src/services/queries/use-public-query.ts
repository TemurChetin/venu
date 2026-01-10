"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { instance } from "../api";
import { queryGenerator } from "@/lib/query-generator";
import { useDebounces } from "@/hooks/use-debounces";
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
  const { guestId, isLoading: isLoadingGuestId } = useGuestId();

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
  if (requiresGuestId && guestId) {
    finalQuery.guest_id = guestId;
  }

  // Build query string
  if (Object.keys(finalQuery).length > 0) {
    finalUrl += queryGenerator(finalQuery);
  }

  // Apply debouncing if specified
  const debouncedUrl = debounceTime
    ? useDebounces(finalUrl, debounceTime)
    : finalUrl;

  // Debounce data for POST requests if debounceTime is specified
  const dataString = method === "POST" && data ? JSON.stringify(data) : "";
  const debouncedDataString = debounceTime && dataString
    ? useDebounces(dataString, debounceTime)
    : dataString;
  
  // Parse debounced data safely
  let debouncedData = data;
  if (debouncedDataString && method === "POST") {
    try {
      debouncedData = JSON.parse(debouncedDataString);
    } catch {
      // If parsing fails, use original data as fallback
      debouncedData = data;
    }
  }

  // Include debounced data in query key for POST requests
  const queryKey =
    method === "POST" && debouncedData ? [debouncedUrl, debouncedData] : [debouncedUrl];

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const apiUrl = debouncedUrl.startsWith("/api")
          ? debouncedUrl
          : `/api${debouncedUrl}`;

        const { data: responseData } = await instance.request<T>({
          method,
          url: apiUrl,
          data: debouncedData || undefined,
        });

        return responseData;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("React Query Error:", {
            url: debouncedUrl,
            error,
          });
        }
        throw error;
      }
    },
    enabled:
      enabled &&
      (!debounceTime || 
        (debouncedUrl === finalUrl && 
          (method !== "POST" || !data || debouncedDataString === dataString))) &&
      (!requiresGuestId || !isLoadingGuestId),
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
