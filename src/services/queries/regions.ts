"use client";

import { useQuery } from "@tanstack/react-query";
import { instance } from "../api";

export interface Region {
  id: number;
  name: string;
  slug?: string;
}

export interface District {
  id: number;
  name: string;
  region_id?: number;
  slug?: string;
}

export interface RegionsResponse {
  regions?: Region[];
  // API might return array directly
  [key: string]: any;
}

export interface DistrictsResponse {
  districts?: District[];
  // API might return array directly
  [key: string]: any;
}

/**
 * Hook to get all regions
 */
export function useRegions() {
  return useQuery<Region[]>({
    queryKey: ["/api/v1/regions"],
    queryFn: async () => {
      try {
        const apiUrl = "/api/v1/regions";
        const { data } = await instance.get<RegionsResponse | Region[]>(apiUrl);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          return data;
        }
        
        // If response has regions property
        if (data && typeof data === "object" && "regions" in data) {
          return (data as RegionsResponse).regions || [];
        }
        
        // Try to access data directly if it's an object with array values
        const values = Object.values(data || {});
        if (values.length > 0 && Array.isArray(values[0])) {
          return values[0] as Region[];
        }
        
        return [];
      } catch (error: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching regions:", error);
          console.error("Error details:", error?.response?.data);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour (regions don't change often)
    retry: 2,
  });
}

/**
 * Hook to get districts for a specific region
 */
export function useDistricts(regionId: number | null | undefined) {
  return useQuery<District[]>({
    queryKey: ["/api/v1/districts", regionId],
    queryFn: async () => {
      if (!regionId) return [];
      
      try {
        const apiUrl = `/api/v1/districts?region_id=${regionId}`;
        const { data } = await instance.get<DistrictsResponse | District[]>(
          apiUrl
        );
        
        // Handle different response formats
        if (Array.isArray(data)) {
          return data;
        }
        
        // If response has districts property
        if (data && typeof data === "object" && "districts" in data) {
          return (data as DistrictsResponse).districts || [];
        }
        
        // Try to access data directly if it's an object with array values
        const values = Object.values(data || {});
        if (values.length > 0 && Array.isArray(values[0])) {
          return values[0] as District[];
        }
        
        return [];
      } catch (error: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching districts:", error);
          console.error("Error details:", error?.response?.data);
        }
        throw error;
      }
    },
    enabled: !!regionId,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 2,
  });
}

