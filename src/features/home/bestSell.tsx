"use client";

import { ProductCard } from "@/components/common";
import {HomeSkleton} from "@/components/common/homeSkleton";
import { useBestSellingProducts } from "@/services";
import { useTranslations } from "next-intl";

export default function BestSell() {
  const t = useTranslations("home");
  const { data: bestSellingData, isLoading: bestSellingLoading } =
    useBestSellingProducts(12, 0);
  return (
    <div>
      {bestSellingLoading ? (
        <HomeSkleton />
      ) : (
        bestSellingData?.products &&
        bestSellingData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">
              {t("bestSellingProducts")}
            </h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {bestSellingData.products.map((product) => (
                <ProductCard
                  key={`best-selling-${product.slug}`}
                  product={product}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
