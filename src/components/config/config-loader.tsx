"use client";

import { useEffect } from "react";
import { useConfigStore } from "@/stores/config-store";
import { ConfigResponse, useConfig } from "@/services/queries/config";

/**
 * Component that loads website configuration on app initialization
 * and stores it in Zustand store for global access
 */
export function ConfigLoader() {
  const { setConfig, setLoading, setError } = useConfigStore();
  const { data, isLoading, error } = useConfig();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data) {
      // Find UZS currency and add it to config
      const uzsCurrency = data.currency_list?.find(
        (currency) => currency.code.toLowerCase() === "uzs" && currency.status
      );

      // Convert exchange_rate to number and add UZS currency to config
      const configWithUZS = {
        ...data,
        uzsCurrency: uzsCurrency
          ? {
              ...uzsCurrency,
              exchange_rate: parseFloat(uzsCurrency.exchange_rate) || 12700,
            }
          : null,
      };

      setConfig(configWithUZS as ConfigResponse);
    }
  }, [data, setConfig]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [error, setError]);

  // This component doesn't render anything
  return null;
}
