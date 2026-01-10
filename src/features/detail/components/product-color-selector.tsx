import { useTranslations } from "next-intl";
import { ProductDetailResponse } from "@/types/api";

interface ProductColorSelectorProps {
  product: ProductDetailResponse;
  selectedColor: number | null;
  onColorSelect: (colorId: number) => void;
}

export function ProductColorSelector({
  product,
  selectedColor,
  onColorSelect,
}: ProductColorSelectorProps) {
  const t = useTranslations("product");

  if (!product.colors || product.colors.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t("color")}</label>
      <div className="flex items-center gap-3 flex-wrap">
        {product.colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color.id)}
            className={`h-10 w-10 rounded-full border-2 transition-all ${
              selectedColor === color.id
                ? "border-primary scale-110"
                : "border-border"
            }`}
            style={{
              backgroundColor: color.code || "#fff",
            }}
            title={color.name}
            aria-label={`${t("color")} ${color.name}`}
          />
        ))}
      </div>
    </div>
  );
}

