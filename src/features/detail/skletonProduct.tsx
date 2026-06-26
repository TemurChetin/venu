import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Product Gallery Skeleton
export function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="w-full h-[350px] md:h-[650px] rounded-lg" />
      <div className="flex gap-3 overflow-x-auto py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-16 h-24 md:w-20 md:h-32 rounded-lg shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

// Product Info Card Skeleton
export function ProductInfoSkeleton() {
  return (
    <Card className="space-y-6 relative">
      <Skeleton className="absolute top-3 right-3 h-4 w-4 rounded" />
      <CardContent className="space-y-4">
        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Color Selector */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 rounded-md" />
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-11 flex-1 rounded-md" />
            <Skeleton className="h-11 w-11 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Product Description Skeleton
export function ProductDescriptionSkeleton() {
  return (
    <Card className="mb-12">
      <CardContent>
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}

// Product Reviews Skeleton
export function ProductReviewsSkeleton() {
  return (
    <Card className="mb-12">
      <CardContent>
        <Skeleton className="h-7 w-32 mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4 rounded" />
                  ))}
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Related Products Skeleton
export function RelatedProductsSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full max-w-[320px]">
            <div className="relative">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            </div>
            <div className="bg-white mt-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex items-end justify-between">
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MountLoadSkleton() {
  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Product Section Skeleton */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 lg:gap-12 mb-12">
        <div className="lg:col-span-8">
          <ProductGallerySkeleton />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <ProductInfoSkeleton />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-5 w-24 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description Skeleton */}
      <ProductDescriptionSkeleton />

      {/* Reviews Skeleton */}
      <ProductReviewsSkeleton />

      {/* Related Products Skeleton */}
      <RelatedProductsSkeleton />
    </main>
  );
}
