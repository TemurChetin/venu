"use client";

import { ProductCard } from "@/components/common";
import {HomeSkleton} from "@/components/common/homeSkleton";
import { useFeaturedProducts } from "@/services";
import { useTranslations } from "next-intl";

export default function Featured() {
  const t = useTranslations("home");
  const { data: featuredData, isLoading: featuredLoading } =
    useFeaturedProducts(12, 0);
  return (
    <div>
      {featuredLoading ? (
        <HomeSkleton />
      ) : (
        featuredData?.products &&
        featuredData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("featuredProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {featuredData.products.map((product) => (
                <ProductCard
                  key={`featured-${product.slug}`}
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
