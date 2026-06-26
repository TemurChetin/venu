import { Skeleton } from "../ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-[320px]">
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
  );
}
