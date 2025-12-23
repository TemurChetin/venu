/**
 * Environment Configuration
 * Centralized access to environment variables
 */

interface EnvConfig {
  NODE_ENV: string | undefined;
  NEXT_PUBLIC_API: string | undefined;
}

/**
 * Environment configuration object
 * Provides type-safe access to environment variables
 */
const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
};

export default env;
