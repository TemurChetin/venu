"use client";

import { ProductCard } from "@/components/common/product-card";
import { Carousel } from "@/features/home/carousel";
import Link from "next/link";
import {
  useLatestProducts,
  useNewArrivalProducts,
  useTopRatedProducts,
  useBestSellingProducts,
  useFeaturedProducts,
  useBanners,
} from "@/services/queries/products";
import Image from "next/image";
import { BottomBanners } from "@/features/home/bottom-banners";
import { useState, useEffect } from "react";

type Props = {};

function Page({}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
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

  // Fetch banners
  const { data: bannersData, isLoading: bannersLoading } = useBanners();

  // Filter Main Section Banners (published only)
  const mainSectionBanners =
    bannersData?.filter(
      (banner) =>
        banner.banner_type === "Main Section Banner" && banner.published === 1
    ) || [];

  // Show loading state until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Yuklanmoqda...</p>
      </div>
    );
  }

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

      {/* Main Section Banner 1 */}
      {mainSectionBanners.length > 0 && mainSectionBanners[0] && (
        <div className="px-4 py-6">
          {mainSectionBanners[0].url ? (
            <Link
              href={mainSectionBanners[0].url}
              className="block overflow-hidden rounded-2xl hover:opacity-90 transition-opacity"
            >
              <Image
                width={1200}
                height={720}
                src={
                  mainSectionBanners[0].photo_full_url?.path ||
                  "/placeholder.svg"
                }
                alt={mainSectionBanners[0].title || "Banner"}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </Link>
          ) : (
            <div className="overflow-hidden rounded-2xl">
              <Image
                width={1200}
                height={720}
                src={
                  mainSectionBanners[0].photo_full_url?.path ||
                  "/placeholder.svg"
                }
                alt={mainSectionBanners[0].title || "Banner"}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          )}
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

      {/* Main Section Banner 2 */}
      {mainSectionBanners.length > 1 && mainSectionBanners[1] && (
        <div className="px-4 py-6">
          {mainSectionBanners[1].url ? (
            <Link
              href={mainSectionBanners[1].url}
              className="block overflow-hidden rounded-2xl hover:opacity-90 transition-opacity"
            >
              <Image
                width={1200}
                height={720}
                src={
                  mainSectionBanners[1].photo_full_url?.path ||
                  "/placeholder.svg"
                }
                alt={mainSectionBanners[1].title || "Banner"}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </Link>
          ) : (
            <div className="overflow-hidden rounded-2xl">
              <Image
                width={1200}
                height={720}
                src={
                  mainSectionBanners[1].photo_full_url?.path ||
                  "/placeholder.svg"
                }
                alt={mainSectionBanners[1].title || "Banner"}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          )}
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

      {/* Additional Main Section Banners */}
      {mainSectionBanners.length > 2 &&
        mainSectionBanners.slice(2).map((banner, index) => (
          <div key={banner.id} className="px-4 py-6">
            {banner.url ? (
              <Link
                href={banner.url}
                className="block overflow-hidden rounded-2xl hover:opacity-90 transition-opacity"
              >
                <Image
                  width={1200}
                  height={720}
                  src={banner.photo_full_url?.path || "/placeholder.svg"}
                  alt={banner.title || "Banner"}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </Link>
            ) : (
              <div className="overflow-hidden rounded-2xl">
                <Image
                  width={1200}
                  height={720}
                  src={banner.photo_full_url?.path || "/placeholder.svg"}
                  alt={banner.title || "Banner"}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            )}
          </div>
        ))}

      <BottomBanners />
    </>
  );
}

export default Page;
