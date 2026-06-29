import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyCheckout() {
  const t = useTranslations("checkout");
  const router = useRouter();
  return (
    <div className="w-full mt-4">
      <h1 className="mb-8 text-3xl font-bold text-foreground">{t("title")}</h1>
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <p className="text-lg text-muted-foreground">{t("emptyCart")}</p>
        <Button onClick={() => router.push("/")} className="mt-6">
          {t("goHome")}
        </Button>
      </div>
    </div>
  );
}

export function LoadCheckout() {
  return (
    <div className="w-full mt-4">
      <Skeleton className="mb-8 h-9 w-64" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Form Skeleton */}
        <div className="col-span-12 lg:col-span-8">
          <div className="space-y-6">
            {/* Address Selection Skeleton */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-9 w-32" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg border border-border p-4"
                  >
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full max-w-md" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Method Skeleton */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Skeleton className="mb-6 h-7 w-40" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Skeleton */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Skeleton className="mb-6 h-7 w-32" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary Skeleton */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Skeleton className="mb-4 h-7 w-32" />

              {/* Cart Items Skeleton */}
              <div className="space-y-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Skeleton */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-16 w-full rounded-lg mt-4" />
              </div>

              <Skeleton className="mt-6 h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
