"use client";

import { ProductCard } from "@/components/common/product-card";
import { Carousel } from "@/features/home/carousel";
import Image from "next/image";
import {
  useLatestProducts,
  useNewArrivalProducts,
  useTopRatedProducts,
  useBestSellingProducts,
  useFeaturedProducts,
} from "@/services/queries/products";

type Props = {};

function Page({}: Props) {
  // Fetch all product lists
  const { data: latestData, isLoading: latestLoading } = useLatestProducts(
    10,
    0
  );

  const { data: newArrivalData, isLoading: newArrivalLoading } =
    useNewArrivalProducts(10, 0);
  const { data: topRatedData, isLoading: topRatedLoading } =
    useTopRatedProducts(10, 0);
  const { data: bestSellingData, isLoading: bestSellingLoading } =
    useBestSellingProducts(10, 0);
  const { data: featuredData, isLoading: featuredLoading } =
    useFeaturedProducts(10, 0);

  return (
    <>
      <Carousel />

      {/* Latest Products */}
      {latestData?.products && latestData.products.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Eng so'nggi mahsulotlar</h2>
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {latestData.products.map((product) => (
              <ProductCard key={`latest-${product.slug}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* New Arrival Products */}
      {newArrivalData?.products && newArrivalData.products.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Yangi kelgan mahsulotlar</h2>
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {newArrivalData.products.map((product) => (
              <ProductCard
                key={`new-arrival-${product.slug}`}
                product={product}
              />
            ))}
          </div>
        </div>
      )}

      {/* Timeout Banner  */}
      {/* Timeout banner only works on large screens */}
      <div className="px-4">
        <Image
          src="https://venu.uz/storage/banner/2025-09-17-68ca3be65996d.webp"
          alt="Timeout Banner"
          className="w-full h-auto hidden lg:block my-8 rounded-lg"
          width={1200}
          height={720}
        />
      </div>

      {/* Top Rated Products */}
      {topRatedData?.products && topRatedData.products.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Eng yuqori reytingli</h2>
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {topRatedData.products.map((product) => (
              <ProductCard
                key={`top-rated-${product.slug}`}
                product={product}
              />
            ))}
          </div>
        </div>
      )}

      {/* Best Selling Products */}
      {bestSellingData?.products && bestSellingData.products.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Eng ko'p sotilgan</h2>
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {bestSellingData.products.map((product) => (
              <ProductCard
                key={`best-selling-${product.slug}`}
                product={product}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      {featuredData?.products && featuredData.products.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Taniqli mahsulotlar</h2>
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredData.products.map((product) => (
              <ProductCard key={`featured-${product.slug}`} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
