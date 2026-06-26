"use client";

import { ProductCard } from "@/components/common";
import {HomeSkleton} from "@/components/common/homeSkleton";
import { useSeasonalProducts } from "@/services";
import { useTranslations } from "next-intl";

export default function Seasonal() {
  const t = useTranslations("home");
  const { data: seasonalData, isLoading: seasonalLoading } =
    useSeasonalProducts(12, 0);
  return (
    <>
      {seasonalLoading ? (
        <HomeSkleton />
      ) : (
        seasonalData?.products &&
        seasonalData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("seasonalProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {seasonalData.products.map((product) => (
                <ProductCard
                  key={`seasonal-${product.slug}`}
                  product={product}
                />
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
}
