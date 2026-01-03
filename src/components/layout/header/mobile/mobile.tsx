"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BottomNavigationWrapper from "./bottom-navigation-wrapper";
import { LanguageSwitcher } from "@/components/common";
import { useTranslations } from "next-intl";

type Props = {};

function MobileHeader({}: Props) {
  const t = useTranslations();

  return (
    <header>
      <div className="container mt-4">
        {/* Searching input decoration */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("common.searchPlaceholder")}
              className="h-11 w-full pl-10 pr-10 bg-accent/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <BottomNavigationWrapper />
    </header>
  );
}

export default MobileHeader;
