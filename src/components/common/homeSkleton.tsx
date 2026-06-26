import { Skeleton } from "../ui/skeleton";
import { ProductCardSkeleton } from "./product-card-skleton";

export function HomeSkleton() {
  return (
    <div className="">
      <Skeleton className="h-7 w-48 mb-4" />
      <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={`discount-skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}

export function BrandSkleton() {
  return (
    <div className="py-6 relative">
      <Skeleton className="h-7 w-32 mb-4" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`brand-skeleton-${i}`}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200"
          >
            <Skeleton className="w-full aspect-square rounded-lg mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BannerSkleton() {
  return (
    <div className="py-6">
      <Skeleton className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl" />
    </div>
  );
}
