"use client";

import { CatalogFilters } from "@/features/search/catalog-filter";
import { ProductGrid } from "@/features/search/product-grid";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProductFilterParams } from "@/services/queries/products";

type Props = {};

function page({}: Props) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  // Helper function to encode search query
  const encodeSearchQuery = (query: string): string => {
    if (!query) return "";
    try {
      return btoa(unescape(encodeURIComponent(query)));
    } catch {
      return "";
    }
  };

  const [filters, setFilters] = useState<ProductFilterParams>({
    search: "",
    category: "[]",
    brand: "[]",
    product_authors: "[]",
    publishing_houses: "[]",
    sort_by: null,
    price_min: null,
    price_max: null,
    limit: "20",
    offset: 0,
    product_type: "all",
  });

  // Update search filter when searchQuery changes
  useEffect(() => {
    const encodedSearch = encodeSearchQuery(searchQuery);
    setFilters((prev) => ({
      ...prev,
      search: encodedSearch,
      offset: 0, // Reset to first page when search changes
    }));
  }, [searchQuery]);

  const handleFiltersChange = (newFilters: ProductFilterParams) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      offset: 0, // Reset offset when filters change
    }));
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row mt-4">
      {/* Sidebar Filters - Hidden on mobile by default */}
      <aside className="hidden lg:block lg:w-64 xl:w-72">
        <CatalogFilters
          searchQuery={searchQuery}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <ProductGrid searchQuery={searchQuery} filters={filters} />
      </div>
    </div>
  );
}

export default page;
