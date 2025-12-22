"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CatalogFilters } from "./catalog-filter";
import { ProductCard } from "@/components/common/product-card";
import { mockDataGenerator } from "@/lib/mock-data";

// Mock product data
const products = mockDataGenerator(30);
export function ProductGrid() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Barcha mahsulotlar
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Jami {products.length} ta mahsulot topildi
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
          <SheetContent side="left" className="w-80 p-0">
            <div className="py-6">
              <CatalogFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-6">
        <Button variant="outline" size="lg" className="min-w-48 bg-transparent">
          Ko'proq yuklash
        </Button>
      </div>
    </div>
  );
}
