"use client";

import { ReactQueryProvider } from "./react-query-provider";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { ConfigLoader } from "@/components/config/config-loader";

interface AppProviderProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

/**
 * Main application provider that wraps all necessary providers
 * - React Query for data fetching
 * - Next Intl for internationalization
 * - Next Auth Session Provider for authentication
 * - Config Loader for website configurations
 */
export function AppProvider({ children, locale, messages }: AppProviderProps) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ConfigLoader />
          {children}
        </NextIntlClientProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
