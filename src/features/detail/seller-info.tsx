"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Clock, Star, Package, Calendar } from "lucide-react";
import { ProductDetailResponse } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useSellerProducts } from "@/services/queries/sellers";

export function SellerInfo({
  seller,
}: {
  seller: ProductDetailResponse["seller"];
}) {
  const params = useParams();
  const lang = (params?.lang as string) || "uz";

  if (!seller || !seller.shop) return null;

  const shop = seller.shop;
  const isShopClosed = shop.temporary_close || shop.vacation_status;
  const shopStatusText = shop.vacation_status
    ? "Ta'tilda"
    : shop.temporary_close
    ? "Vaqtinchalik yopilgan"
    : "Ochiq";

  // Fetch seller products to get total count
  const { data: productsData } = useSellerProducts(seller.id, 1, 0);
  const totalProducts = productsData?.total_size || 0;

  // Calculate years active from shop creation date
  const getYearsActive = () => {
    if (!shop.created_at) return null;
    const createdDate = new Date(shop.created_at);
    const now = new Date();
    const yearsDiff = now.getFullYear() - createdDate.getFullYear();
    const monthDiff = now.getMonth() - createdDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < createdDate.getDate())) {
      return Math.max(0, yearsDiff - 1);
    }
    return yearsDiff;
  };

  const yearsActive = getYearsActive();

  // Calculate average rating if available (assuming seller has rating)
  // This is a placeholder - adjust based on actual API response
  const sellerRating = 4.5; // You may need to get this from seller data
  const reviewCount = 0; // You may need to get this from seller data

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Sotuvchi ma'lumotlari
          </div>
         
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shop Info Section */}
        <Link href={`/seller/${seller.id}`} className="flex flex-col sm:flex-row gap-6">
          {/* Shop/Seller Avatar */}
          <div className="shrink-0">
            {shop.image_full_url?.path ? (
              <div className="relative">
                <Image
                  width={80}
                  height={80}
                  src={shop.image_full_url.path}
                  alt={shop.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover border-2 border-border"
                />
                {isShopClosed && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <Badge variant="destructive" className="text-xs">
                      Yopiq
                    </Badge>
                  </div>
                )}
              </div>
            ) : seller.image_full_url?.path ? (
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border">
                <AvatarImage
                  src={seller.image_full_url.path}
                  alt={`${seller.f_name} ${seller.l_name}`}
                />
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-medium">
                  {seller.f_name[0]}
                  {seller.l_name[0]}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border">
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-medium">
                  <Store className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Shop Details */}
          <div className="flex-1 space-y-4">
            {/* Shop Name and Status */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
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

              {/* Rating and Reviews */}
              {reviewCount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">
                      {sellerRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ({reviewCount} ta sharh)
                  </span>
                </div>
              )}
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
        </Link>

        {/* Shop Statistics Section */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Do'kon statistikasi
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Total Products */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="text-xs">Mahsulotlar</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                {totalProducts.toLocaleString()}
              </span>
            </div>

            {/* Years Active */}
            {yearsActive !== null && (
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">Faol yillar</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {yearsActive} {yearsActive === 1 ? "yil" : "yil"}
                </span>
              </div>
            )}

            {/* Rating (if available) */}
            {reviewCount > 0 && (
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-xs">Reyting</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold text-foreground">
                    {sellerRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({reviewCount})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
