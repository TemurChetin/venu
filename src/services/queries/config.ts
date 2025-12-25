"use client";

import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/instance";
import { useConfigFromStore } from "@/stores/config-store";

export interface Currency {
  id: number;
  name: string;
  symbol: string;
  code: string;
  exchange_rate: string; // From API as string
  status: boolean;
  created_at: string | null;
  updated_at: string;
}

// Currency with exchange_rate as number (for internal use)
export interface CurrencyWithNumberRate {
  id: number;
  name: string;
  symbol: string;
  code: string;
  exchange_rate: number; // Converted to number
  status: boolean;
  created_at: string | null;
  updated_at: string;
}

export interface ConfigResponse {
  system_default_currency: number;
  currency_list: Currency[];
  currency_symbol_position: "left" | "right";
  uzsCurrency?: CurrencyWithNumberRate; // UZS currency with exchange_rate as number
  [key: string]: any;
}

/**
 * Hook to get website configuration including currency exchange rates
 */
export function useConfig() {
  return useQuery<ConfigResponse>({
    queryKey: ["/api/v1/config"],
    queryFn: async () => {
      const { data } = await instance.get<ConfigResponse>("/api/v1/config");
      return data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour (config doesn't change often)
    retry: 2,
  });
}

/**
 * Hook to get UZS currency from config
 * Returns the UZS currency object with exchange_rate as number if available
 */
export function useUZSCurrency(): CurrencyWithNumberRate | null {
  // Try to get from Zustand store first (loaded on app init)
  const configFromStore = useConfigFromStore();

  // Fallback to query if store is not loaded yet
  const { data: configFromQuery } = useConfig();

  const config = configFromStore || configFromQuery;

  // First try to get from uzsCurrency property (added by ConfigLoader, already has number exchange_rate)
  if (config?.uzsCurrency) {
    return config.uzsCurrency;
  }

  // Fallback to searching in currency_list (convert exchange_rate to number)
  const uzsCurrency = config?.currency_list?.find(
    (currency) => currency.code.toLowerCase() === "uzs" && currency.status
  );

  if (!uzsCurrency) {
    return null;
  }

  // Convert exchange_rate to number
  return {
    ...uzsCurrency,
    exchange_rate: parseFloat(uzsCurrency.exchange_rate) || 12700,
  };
}

/**
 * Hook to get UZS exchange rate from USD
 * Returns the exchange rate to convert USD to UZS
 * Now uses Zustand store for better performance
 */
export function useUZSExchangeRate() {
  const uzsCurrency = useUZSCurrency();
  // exchange_rate is already a number in uzsCurrency (converted by ConfigLoader)
  return uzsCurrency?.exchange_rate ?? 12700; // Default fallback
}
