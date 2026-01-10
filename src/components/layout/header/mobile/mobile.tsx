"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BottomNavigationWrapper from "./bottom-navigation-wrapper";
import { LanguageSwitcher } from "@/components/common";
import { useTranslations } from "next-intl";
import IntelisceneSearchInput from "../desktop/inteliscene-search-input";

type Props = {};

function MobileHeader({}: Props) {
  const t = useTranslations();

  return (
    <header>
      <div className="container mt-4">
        {/* Searching input decoration */}
        <div className="flex gap-2 items-center">
          <IntelisceneSearchInput />
          <LanguageSwitcher />
        </div>
      </div>

      <BottomNavigationWrapper />
    </header>
  );
}

export default MobileHeader;
