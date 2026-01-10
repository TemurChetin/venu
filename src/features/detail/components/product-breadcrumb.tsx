import { useTranslations } from "next-intl";
import { ProductDetailResponse } from "@/types/api";

interface ProductBreadcrumbProps {
  product: ProductDetailResponse;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const t = useTranslations("product");

  return (
    <nav className="mb-6 text-sm text-muted-foreground">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>{t("home")}</li>
        <li>/</li>
        {product.category && (
          <>
            <li>{product.category.name}</li>
            <li>/</li>
          </>
        )}
        <li className="text-foreground">{product.name}</li>
      </ol>
    </nav>
  );
}


