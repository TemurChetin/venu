import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ProductDetailResponse } from "@/types/api";

interface ProductSizeSelectorProps {
  product: ProductDetailResponse;
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}

export function ProductSizeSelector({
  product,
  selectedSize,
  onSizeSelect,
}: ProductSizeSelectorProps) {
  const t = useTranslations("product");

  if (!product.sizes || product.sizes.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t("size")}</label>
      <div className="flex items-center gap-3 flex-wrap">
        {product.sizes.map((size) => (
          <Button
            key={size.id}
            variant={selectedSize === size.value ? "default" : "outline"}
            onClick={() => onSizeSelect(size.value)}
            className="min-w-[80px]"
          >
            {size.value}
          </Button>
        ))}
      </div>
    </div>
  );
}

