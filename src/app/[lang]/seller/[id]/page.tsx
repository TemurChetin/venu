"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { Store, Clock, Package, Calendar, ShoppingCart } from "lucide-react";
import { useSeller, useSellerProducts } from "@/services/queries/sellers";
import { ProductCard } from "@/components/common/product-card";
import { useState } from "react";
import Image from "next/image";
import { useFormatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/formatDate";

export default function SellerPage() {
  const t = useTranslations("seller");
  const params = useParams();
  const sellerId = params?.id as string;
  const lang = (params?.lang as string) || "uz";
  const formatCurrency = useFormatCurrency();

  const { data: sellerData, isLoading: isLoadingSeller } = useSeller(sellerId);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const offset = (currentPage - 1) * limit;

  const { data: productsData, isLoading: isLoadingProducts } = useSellerProducts(
    sellerId,
    limit,
    offset
  );

  const seller = sellerData?.seller;
  const products = productsData?.products || [];
  const totalSize = productsData?.total_size || 0;
  const totalPages = Math.ceil(totalSize / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoadingSeller) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <SellerPageSkeleton />
      </main>
    );
  }

  if (!seller || !seller.shop) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">{t("notFound")}</p>
        </div>
      </main>
    );
  }

  const shop = seller.shop;
  const isShopClosed = shop.temporary_close || shop.vacation_status;
  const shopStatusText = shop.vacation_status
    ? t("onVacation")
    : shop.temporary_close
    ? t("temporarilyClosed")
    : t("open");

  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      {/* Seller Info Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Seller/Shop Avatar */}
            <div className="shrink-0">
              {shop.image_full_url?.path ? (
                <div className="relative">
                  <Image
                    width={120}
                    height={120}
                    src={shop.image_full_url.path}
                    alt={shop.name}
                    className="h-24 w-24 md:h-32 md:w-32 rounded-lg object-cover border-2 border-border"
                  />
                  {isShopClosed && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                      <Badge variant="destructive" className="text-xs">
                        {t("closed")}
                      </Badge>
                    </div>
                  )}
                </div>
              ) : seller.image_full_url?.path ? (
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-border">
                  <AvatarImage
                    src={seller.image_full_url.path}
                    alt={`${seller.f_name} ${seller.l_name}`}
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-medium">
                    {seller.f_name[0]}
                    {seller.l_name[0]}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-border">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-medium">
                    <Store className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Seller Details */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {shop.name}
                  </h1>
                  <p className="text-base text-muted-foreground mt-1">
                    {seller.f_name} {seller.l_name}
                  </p>
                </div>
                <Badge
                  variant={isShopClosed ? "destructive" : "default"}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {shopStatusText}
                </Badge>
              </div>

              {/* Vacation Note */}
              {shop.vacation_status && shop.vacation_note && (
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    {shop.vacation_note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {t("statistics")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Products */}
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border">
              <Package className="h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalSize}</p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {t("totalProductsStat")}
              </p>
            </div>

            {/* Member Since */}
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <p className="text-lg font-bold text-foreground">
                {formatDate(shop.created_at)}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {t("memberSince")}
              </p>
            </div>

            {/* Minimum Order */}
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border">
              <ShoppingCart className="h-8 w-8 text-primary mb-2" />
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(seller.minimum_order_amount)}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {t("minimumOrder")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("products")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isLoadingProducts ? (
              t("loading")
            ) : (
              <>
                {t("totalProducts", { count: totalSize })}
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {isLoadingProducts && products.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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
            <p className="text-muted-foreground">{t("noProducts")}</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Skeleton Component
function SellerPageSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-lg shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
