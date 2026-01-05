"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="size-5" />
              {t("goHome")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/search">
              <Search className="size-5" />
              {t("goSearch")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
