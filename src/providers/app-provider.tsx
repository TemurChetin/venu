"use client";

import { ReactQueryProvider } from "./react-query-provider";
import { NextIntlClientProvider } from "next-intl";

interface AppProviderProps {
  children: React.ReactNode;
  locale: string;
}

/**
 * Main application provider that wraps all necessary providers
 * - React Query for data fetching
 * - Next Intl for internationalization
 */
export function AppProvider({ children, locale }: AppProviderProps) {
  return (
    <ReactQueryProvider>
      <NextIntlClientProvider locale={locale}>
        {children}
      </NextIntlClientProvider>
    </ReactQueryProvider>
  );
}
