import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

interface ProductBreadcrumbProps {
  id: number;
  name: string;
}

export function ProductBreadcrumb({ name, id }: ProductBreadcrumbProps) {
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
        {name && (
          <>
            <li>
              <Link
                href={`/${lang}/search?category=${id}`}
                className="hover:text-foreground transition-colors"
              >
                {name}
              </Link>
            </li>
            <li>/</li>
          </>
        )}
        <li className="text-foreground">{name}</li>
      </ol>
    </nav>
  );
}
