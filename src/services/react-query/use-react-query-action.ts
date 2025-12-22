"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { instanceAuth } from "../instance";
import { queryGenerator } from "@/lib/query-generator";
import { useDebounces } from "@/hooks/use-debounces";

export const useReactQueryAction = <T>({
  url,
  query,
  debounceTime,
  enabled = true,
  method = "GET",
  data,
  refetchInterval,
  refetchIntervalInBackground,
}: {
  url: string;
  query?: Record<string, any>;
  debounceTime?: number;
  enabled?: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  refetchInterval?: number | false;
  refetchIntervalInBackground?: boolean;
}) => {
  const params = useParams();

  Object.keys(params).forEach((key) => {
    const regex = new RegExp(`\\[${key}\\]`, "g");
    const value = Array.isArray(params[key])
      ? params[key]?.[0] // agar array bo'lsa — birinchi elementni olamiz
      : params[key];

    if (value !== undefined) {
      url = url.replace(regex, String(value));
    }
  });

  // ✅ Agar query object bo'lsa, uni stringga qo'shamiz
  if (query) {
    url += queryGenerator(query);
  }

  // ✅ Debounce ishlatish (ixtiyoriy)
  const debouncedUrl = debounceTime ? useDebounces(url, debounceTime) : url;

  return useQuery<T>({
    queryKey: [debouncedUrl],
    queryFn: async () => {
      try {
        const { data: responseData } = await instanceAuth.request({
          method,
          url: debouncedUrl,
          data,
        });
        return responseData;
      } catch (error) {
        // Development'da error'ni console'ga chiqarish
        if (process.env.NODE_ENV === "development") {
          console.error("React Query Error:", {
            url: debouncedUrl,
            error: error,
            originalError: error,
          });
        }

        // Error'ni throw qilish React Query'ga error state'ni berish uchun
        throw error;
      }
    },
    // ✅ Debounce bo'lsa, URL tayyor bo'lganda ishga tushsin
    enabled: enabled && (!debounceTime || debouncedUrl === url),
    retry: (failureCount, error) => {
      // 401, 403, 404 kabi error'larda retry qilmaslik
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as any).status;
        if ([401, 403, 404].includes(status)) {
          return false;
        }
      }
      // Boshqa error'larda 3 marta retry qilish
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 1000 * 60 * 5,
    refetchInterval,
    refetchIntervalInBackground,
  });
};
