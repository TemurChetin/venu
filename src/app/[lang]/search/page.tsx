import { CatalogFilters } from "@/features/search/catalog-filter";
import { ProductGrid } from "@/features/search/product-grid";
import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row mt-4">
      {/* Sidebar Filters - Hidden on mobile by default */}
      <aside className="hidden lg:block lg:w-64 xl:w-72">
        <CatalogFilters />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <ProductGrid />
      </div>
    </div>
  );
}

export default page;
