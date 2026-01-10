import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class merging
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Helper function to encode search query
export const encodeSearchQuery = (query: string): string => {
  if (!query) return "";
  try {
    return btoa(unescape(encodeURIComponent(query)));
  } catch {
    return "";
  }
};
