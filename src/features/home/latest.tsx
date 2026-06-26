"use client";

import { ProductCard } from "@/components/common";
import {HomeSkleton} from "@/components/common/homeSkleton";
import { useLatestProducts } from "@/services";
import { useTranslations } from "next-intl";

export default function Latest() {
  const t = useTranslations("home");
  const { data: latestData, isLoading: latestLoading } = useLatestProducts(
    12,
    0,
  );
  return (
    <div>
      {latestLoading ? (
        <HomeSkleton />
      ) : (
        latestData?.products &&
        latestData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("latestProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {latestData.products.map((product) => (
                <ProductCard key={`latest-${product.slug}`} product={product} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
