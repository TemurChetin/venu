"use client";

import { CatalogFilters } from "@/features/search/catalog-filter";
import { ProductGrid } from "@/features/search/product-grid";
import { MobileCategorySelector } from "@/features/search/mobile-category-selector";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProductFilterParams } from "@/services/queries/products";
import { encodeSearchQuery } from "@/lib";
import useDeviceDetect from "@/hooks/use-device";

type Props = {};

function page({}: Props) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const { isMobile } = useDeviceDetect();

  // Parse category from URL (can be ID number or slug)
  const parseCategoryId = (categoryParam: string | null): number | null => {
    if (!categoryParam) return null;
    const categoryId = parseInt(categoryParam, 10);
    return isNaN(categoryId) ? null : categoryId;
  };

  // Parse brand from URL
  const parseBrand = (brandParam: string | null): string => {
    if (!brandParam) return "[]";
    try {
      // Try to decode and parse as JSON
      const decoded = decodeURIComponent(brandParam);
      const parsed = JSON.parse(decoded);
      // Ensure it's a valid array
      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed);
      }
      return "[]";
    } catch {
      // If parsing fails, return empty array
      return "[]";
    }
  };

  const [filters, setFilters] = useState<ProductFilterParams>({
    search: "",
    category: parseCategoryId(categoryParam),
    brand: parseBrand(brandParam),
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

  // Update category filter when categoryParam changes
  useEffect(() => {
    const categoryId = parseCategoryId(categoryParam);
    setFilters((prev) => ({
      ...prev,
      category: categoryId,
      offset: 0, // Reset to first page when category changes
    }));
  }, [categoryParam]);

  // Update brand filter when brandParam changes
  useEffect(() => {
    const brandValue = parseBrand(brandParam);
    setFilters((prev) => ({
      ...prev,
      brand: brandValue,
      offset: 0, // Reset to first page when brand changes
    }));
  }, [brandParam]);

  const handleFiltersChange = (newFilters: ProductFilterParams) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      offset: 0, // Reset offset when filters change
    }));
  };

  // On mobile, show category selector when no category is selected
  const showCategorySelector = isMobile && !categoryParam && !searchQuery;

  return (
    <div className="flex flex-col gap-6 lg:flex-row mt-4">
      {/* Mobile Category Selector - Only shown on mobile when no category/search is selected */}
      {showCategorySelector ? (
        <div className="w-full">
          <MobileCategorySelector />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default page;
