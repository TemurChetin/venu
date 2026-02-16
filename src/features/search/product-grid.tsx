"use client";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CatalogFilters } from "./catalog-filter";
import { ProductCard } from "@/components/common/product-card";
import {
  useProductFilter,
  type ProductFilterParams,
} from "@/services/queries/products";
import React, { useState, useMemo } from "react";

interface ProductGridProps {
  searchQuery?: string;
  filters: ProductFilterParams;
}

export function ProductGrid({ searchQuery, filters }: ProductGridProps) {
  const [currentFilters, setCurrentFilters] =
    useState<ProductFilterParams>(filters);
  const { data, isLoading, error } = useProductFilter(currentFilters);

  // Update filters when props change
  React.useEffect(() => {
    setCurrentFilters(filters);
  }, [filters]);

  const products = data?.products || [];
  const totalSize = data?.total_size || 0;
  const limit = parseInt(currentFilters.limit || "20", 10);

  // Calculate pagination values
  const currentPage = useMemo(() => {
    const offset = currentFilters.offset || 1;
    return offset;
  }, [currentFilters.offset]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalSize / limit);
  }, [totalSize, limit]);

  const handlePageChange = (page: number) => {
    const newOffset = page;
    setCurrentFilters((prev) => ({
      ...prev,
      offset: newOffset,
    }));
    // Scroll to top of product grid when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiltersChange = (newFilters: ProductFilterParams) => {
    setCurrentFilters((prev) => ({
      ...prev,
      ...newFilters,
      offset: 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            {searchQuery ? `"${searchQuery}" qidiruvi` : "Barcha mahsulotlar"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? (
              "Yuklanmoqda..."
            ) : error ? (
              "Xatolik yuz berdi"
            ) : (
              <>Jami {totalSize} ta mahsulot topildi</>
            )}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-2 bg-transparent"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtr
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 flex flex-col">
            <div className="flex-1 overflow-y-auto py-6">
              <CatalogFilters
                searchQuery={searchQuery}
                filters={currentFilters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Product Grid */}
      {isLoading && products.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Mahsulotlar yuklanmadi</p>
          <Button
            variant="outline"
            onClick={() => setCurrentFilters((prev) => ({ ...prev }))}
            className="mt-4"
          >
            Qayta urinish
          </Button>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Mahsulotlar topilmadi</p>
        </div>
      )}
    </div>
  );
}
