"use client";

import { ReactQueryProvider } from "./react-query-provider";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";

interface AppProviderProps {
  children: React.ReactNode;
  locale: string;
}

/**
 * Main application provider that wraps all necessary providers
 * - React Query for data fetching
 * - Next Intl for internationalization
 * - Next Auth Session Provider for authentication
 */
export function AppProvider({ children, locale }: AppProviderProps) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
