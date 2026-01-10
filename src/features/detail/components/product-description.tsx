import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ProductDetailResponse } from "@/types/api";

interface ProductDescriptionProps {
  product: ProductDetailResponse;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const t = useTranslations("product");

  if (!product.details) return null;

  return (
    <Card className="mb-12">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">{t("about")}</h2>
        <div
          className="space-y-4 text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.details }}
        />
      </CardContent>
    </Card>
  );
}
