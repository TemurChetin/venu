import axios, { AxiosInstance } from "axios";
import { getSession, signOut } from "next-auth/react";

/**
 * API Configuration Constants
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API || "";
const API_PREFIX = "/api";

/**
 * Get current locale from URL path or cookie
 * Priority: URL path > Cookie > Default
 */
function getCurrentLocale(): string {
  if (typeof window === "undefined") {
    return "uz"; // Default for server-side
  }

  // First, try to get from URL path (most reliable)
  const pathname = window.location.pathname;
  const langMatch = pathname.match(/^\/(uz|ru)(\/|$)/);
  if (langMatch && langMatch[1]) {
    return langMatch[1];
  }

  // Fallback: try to get from cookie
  // next-intl may store locale in various cookie names
  const cookies = document.cookie.split(";");
  const localeCookieNames = ["NEXT_LOCALE", "locale", "lang"];

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (
      localeCookieNames.includes(name) &&
      value &&
      (value === "uz" || value === "ru")
    ) {
      return value;
    }
  }

  // Default locale
  return "uz";
}

/**
 * Public Axios Instance
 * Used for unauthenticated API requests
 */
export const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add lang header to all public requests
instance.interceptors.request.use(
  (config) => {
    const locale = getCurrentLocale();
    config.headers["lang"] = locale;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Authenticated Axios Instance
 * Used for authenticated API requests with automatic token injection
 */
export const instanceAuth: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
});

/**
 * Request Interceptor for Authenticated Instance
 * Automatically adds Authorization header with access token and lang header
 */
import {
  getCachedToken,
  isSessionResolved,
  setAccessToken,
} from "./token-store";

instanceAuth.interceptors.request.use(
  async (config) => {
    let token = getCachedToken();

    // Cold-start fallback: TokenSync hali ulgurmagan bo'lsa, BIR marta
    // getSession qilamiz va keshlaymiz. Keyingi barcha so'rovlar sinxron o'qiydi.
    if (!token && !isSessionResolved()) {
      const session = await getSession();
      token = (session as any)?.accessToken ?? null;
      setAccessToken(token);
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["lang"] = getCurrentLocale();
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor for Authenticated Instance
 * Handles 401 errors and token refresh logic
 */
instanceAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    const session = await getSession();

    // Handle 401 Unauthorized - attempt token refresh
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;

      // TODO: Implement token refresh logic
      // const newAccessToken = await refreshAccessToken();
      // if (newAccessToken) {
      //   prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      //   return instanceAuth(prevRequest);
      // }

      // If token refresh fails, sign out user in production
      if (process.env.NODE_ENV === "production") {
        await signOut();
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
