import axios, { AxiosInstance } from "axios";
import { getSession, signOut } from "next-auth/react";

/**
 * API Configuration Constants
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API || "";
const API_PREFIX = "/api";

/**
 * Public Axios Instance
 * Used for unauthenticated API requests
 */
export const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Authenticated Axios Instance
 * Used for authenticated API requests with automatic token injection
 */
export const instanceAuth: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
});

/**
 * Request Interceptor for Authenticated Instance
 * Automatically adds Authorization header with access token
 */
instanceAuth.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    // Extract access token from session
    const accessToken = (session as any)?.accessToken;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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
  }
);
