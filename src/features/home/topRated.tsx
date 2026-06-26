"use client";

import { ProductCard } from "@/components/common";
import {HomeSkleton} from "@/components/common/homeSkleton";
import { useTopRatedProducts } from "@/services";
import { useTranslations } from "next-intl";

export default function TopRated() {
  const t = useTranslations("home");
  const { data: topRatedData, isLoading: topRatedLoading } =
    useTopRatedProducts(12, 0);
  return (
    <div>
      {topRatedLoading ? (
        <HomeSkleton />
      ) : (
        topRatedData?.products &&
        topRatedData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("topRatedProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {topRatedData.products.map((product) => (
                <ProductCard
                  key={`top-rated-${product.slug}`}
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
