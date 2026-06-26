"use client";

import { ProductCard } from "@/components/common";
import { HomeSkleton } from "@/components/common/homeSkleton";
import { useNewArrivalProducts } from "@/services";
import { useTranslations } from "next-intl";

export default function NewArrival() {
  const t = useTranslations("home");
  const { data: newArrivalData, isLoading: newArrivalLoading } =
    useNewArrivalProducts(12, 0);
  return (
    <div>
      {newArrivalLoading ? (
        <HomeSkleton />
      ) : (
        newArrivalData?.products &&
        newArrivalData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">
              {t("newArrivalProducts")}
            </h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {newArrivalData.products.map((product) => (
                <ProductCard
                  key={`new-arrival-${product.slug}`}
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
