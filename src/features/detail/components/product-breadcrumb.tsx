import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ProductDetailResponse } from "@/types/api";

interface ProductBreadcrumbProps {
  product: ProductDetailResponse;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const t = useTranslations("product");
  const lang = useLocale();

  return (
    <nav className="mb-6 mt-2 text-sm text-muted-foreground">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link href={`/`} className="hover:text-foreground transition-colors">
            {t("home")}
          </Link>
        </li>
        <li>/</li>
        {product.category && (
          <>
            <li>
              <Link
                href={`/${lang}/search?category=${product.category.id}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
          </>
        )}
        <li className="text-foreground">{product.name}</li>
      </ol>
    </nav>
  );
}
