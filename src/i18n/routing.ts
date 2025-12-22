import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { LANGUAGES } from "@/lib/constants";

export const localeConfig = {
  // A list of all locales that are supported (must match `messages/` files)
  locales: LANGUAGES.map((lang) => lang.code),

  // Used when no locale matches
  defaultLocale: LANGUAGES[0].code,
};

export const routing = defineRouting(localeConfig);

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
