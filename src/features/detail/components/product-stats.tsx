import { useTranslations } from "next-intl";
import { ProductDetailResponse } from "@/types/api";

interface ProductStatsProps {
  product: ProductDetailResponse;
}

export function ProductStats({ product }: ProductStatsProps) {
  const t = useTranslations("product");

  const reviewCount = product.review_count || product.reviews_count || 0;
  const wishlistCount = product.wish_list || product.wish_list_count || 0;

  return (
    <div className="grid grid-cols-3 gap-4 pt-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-primary">0</p>
        <p className="text-xs text-muted-foreground">{t("orders")}</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-primary">{reviewCount}</p>
        <p className="text-xs text-muted-foreground">{t("reviewsCount")}</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-primary">{wishlistCount}</p>
        <p className="text-xs text-muted-foreground">{t("inWishlist")}</p>
      </div>
    </div>
  );
}

