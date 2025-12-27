/**
 * Environment Configuration
 * Centralized access to environment variables
 */

interface EnvConfig {
  NODE_ENV: string | undefined;
  NEXT_PUBLIC_API: string | undefined;
  NEXT_PUBLIC_YANDEX_MAPS_API_KEY: string | undefined;
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string | undefined;
}

/**
 * Environment configuration object
 * Provides type-safe access to environment variables
 */
const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  NEXT_PUBLIC_YANDEX_MAPS_API_KEY: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
};

export default env;
