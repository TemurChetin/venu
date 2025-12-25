import { create } from "zustand";
import {
  ConfigResponse,
  CurrencyWithNumberRate,
} from "@/services/queries/config";

interface ConfigState {
  config: ConfigResponse | null;
  isLoading: boolean;
  error: Error | null;
  setConfig: (config: ConfigResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Zustand store for website configurations
 * Loaded once on app initialization and available everywhere
 */
export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  isLoading: false,
  error: null,
  setConfig: (config) => set({ config, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));

/**
 * Helper hook to get config from store
 * Returns null if config is not loaded yet
 */
export function useConfigFromStore() {
  return useConfigStore((state) => state.config);
}

/**
 * Helper hook to check if config is loading
 */
export function useConfigLoading() {
  return useConfigStore((state) => state.isLoading);
}

/**
 * Helper hook to get config error
 */
export function useConfigError() {
  return useConfigStore((state) => state.error);
}

/**
 * Helper hook to get UZS currency from config store
 * Returns the UZS currency object with exchange_rate as number if available, null otherwise
 */
export function useUZSCurrencyFromStore(): CurrencyWithNumberRate | null {
  return useConfigStore((state) => state.config?.uzsCurrency || null);
}
