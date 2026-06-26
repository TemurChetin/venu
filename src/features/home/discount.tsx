"use client";
import { ProductCard } from "@/components/common";
import {HomeSkleton} from "@/components/common/homeSkleton";
import { ProductCardSkeleton } from "@/components/common/product-card-skleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscountProducts } from "@/services";
import { useTranslations } from "next-intl";

export default function DiscountProducts() {
  const t = useTranslations("home");
  const { data: discountData, isLoading: discountLoading } =
    useDiscountProducts(1000, 0);
  return (
    <>
      {discountLoading ? (
        <HomeSkleton />
      ) : (
        discountData?.products &&
        discountData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("discountProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {discountData.products.map((product) => (
                <ProductCard
                  key={`discount-${product.slug}`}
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
