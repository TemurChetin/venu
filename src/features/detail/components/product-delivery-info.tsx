import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";
import { ProductDetailResponse } from "@/types/api";

interface ProductDeliveryInfoProps {
  product: ProductDetailResponse;
}

export function ProductDeliveryInfo({ product }: ProductDeliveryInfoProps) {
  const t = useTranslations("product");

  if (!product.shipping_methods || product.shipping_methods.length === 0) {
    return null;
  }

  const shippingMethod = product.shipping_methods[0];

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
      <Truck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="font-medium text-sm">{shippingMethod.name}</p>
        <p className="text-sm text-muted-foreground">
          {shippingMethod.estimated_days} {t("deliveryDays")}
        </p>
      </div>
    </div>
  );
}


