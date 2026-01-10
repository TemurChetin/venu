import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useFormatCurrency } from "@/lib/format-currency";
import { ProductDetailResponse } from "@/types/api";
import { useProductPrice } from "../hooks/use-product-price";

interface ProductPriceDisplayProps {
  product: ProductDetailResponse;
}

export function ProductPriceDisplay({ product }: ProductPriceDisplayProps) {
  const t = useTranslations("product");
  const formatCurrency = useFormatCurrency();
  const priceInfo = useProductPrice(product);

  if (!priceInfo) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-4xl font-bold text-primary">
          {formatCurrency(Math.round(priceInfo.discountedPrice))}
        </span>
        {priceInfo.discountPercent > 0 && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatCurrency(Math.round(priceInfo.originalPrice))}
            </span>
            <Badge variant="destructive" className="bg-primary">
              -{priceInfo.discountPercent}%
            </Badge>
          </>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {t("available", { stock: product.current_stock })}
      </p>
    </div>
  );
}
