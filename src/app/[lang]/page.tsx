"use client";

import { ProductCard } from "@/components/common/product-card";
import { Carousel } from "@/features/home/carousel";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  useLatestProducts,
  useNewArrivalProducts,
  useTopRatedProducts,
  useBestSellingProducts,
  useFeaturedProducts,
  useBanners,
  useDiscountProducts,
  useSeasonalProducts,
  useBrands,
} from "@/services/queries/products";
import Image from "next/image";
import { BottomBanners } from "@/features/home/bottom-banners";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Skeleton } from "@/components/ui/skeleton";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

type Props = {
  limit: number;
  offset: number;
};

// Product Card Skeleton Loader Component
function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-[320px]">
      <div className="relative">
        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
      </div>
      <div className="bg-white mt-4">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function Page({ }: Props) {
  const t = useTranslations("home");

  // Swiper ref for brands carousel
  const brandsSwiperRef = useRef<SwiperType | null>(null);

  // Fetch all product lists
  const { data: latestData, isLoading: latestLoading } = useLatestProducts(
    12,
    0
  );
  const { data: discountData, isLoading: discountLoading } =
    useDiscountProducts(1000, 0);
  const { data: seasonalData, isLoading: seasonalLoading } =
    useSeasonalProducts(12, 0);
  const { data: newArrivalData, isLoading: newArrivalLoading } =
    useNewArrivalProducts(12, 0);
  const { data: topRatedData, isLoading: topRatedLoading } =
    useTopRatedProducts(12, 0);
  const { data: bestSellingData, isLoading: bestSellingLoading } =
    useBestSellingProducts(12, 0);
  const { data: featuredData, isLoading: featuredLoading } =
    useFeaturedProducts(12, 0);

  // Fetch banners
  const { data: bannersData, isLoading: bannersLoading } = useBanners();

  // Fetch brands
  const { data: brandsData, isLoading: brandsLoading } = useBrands();

  // Filter Main Section Banners (published only)
  const mainSectionBanners =
    bannersData?.filter(
      (banner) =>
        banner.banner_type === "Main Section Banner" && banner.published === 1
    ) || [];

  return (
    <>
      <Carousel />

      {/* Discount Products */}
      {discountLoading ? (
        <div className="">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`discount-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        discountData?.products &&
        discountData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("discountProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      {/* Seasonal Products */}
      {seasonalLoading ? (
        <div className="">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`seasonal-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        seasonalData?.products &&
        seasonalData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("seasonalProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      {/* Latest Products */}
      {latestLoading ? (
        <div className="">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`latest-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        latestData?.products &&
        latestData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("latestProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {latestData.products.map((product) => (
                <ProductCard key={`latest-${product.slug}`} product={product} />
              ))}
            </div>
          </div>
        )
      )}

      {/* Main Section Banner 1 */}
      {bannersLoading ? (
        <div className="py-6">
          <Skeleton className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl" />
        </div>
      ) : (
        mainSectionBanners.length > 0 &&
        mainSectionBanners[0] && (
          <div className=" py-6">
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
        )
      )}

      {/* New Arrival Products */}
      {newArrivalLoading ? (
        <div className="">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`new-arrival-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        newArrivalData?.products &&
        newArrivalData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">
              {t("newArrivalProducts")}
            </h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      {/* Top Rated Products */}
      {topRatedLoading ? (
        <div className="">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`top-rated-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        topRatedData?.products &&
        topRatedData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("topRatedProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      {/* Main Section Banner 2 */}
      {bannersLoading ? (
        <div className="py-6">
          <Skeleton className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl" />
        </div>
      ) : (
        mainSectionBanners.length > 1 &&
        mainSectionBanners[1] && (
          <div className=" py-6">
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
        )
      )}

      {/* Best Selling Products */}
      {bestSellingLoading ? (
        <div className="">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`best-selling-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        bestSellingData?.products &&
        bestSellingData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">
              {t("bestSellingProducts")}
            </h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      {/* Featured Products */}
      {featuredLoading ? (
        <div className="">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`featured-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        featuredData?.products &&
        featuredData.products.length > 0 && (
          <div className="">
            <h2 className="text-xl font-bold mb-4">{t("featuredProducts")}</h2>
            <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      {/* Brands Section */}
      {brandsLoading ? (
        <div className="py-6 relative">
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`brand-skeleton-${i}`}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200"
              >
                <Skeleton className="w-full aspect-square rounded-lg mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        brandsData?.brands &&
        brandsData.brands.length > 0 && (
          <div className=" py-6 relative">
            <h2 className="text-xl font-bold mb-4">{t("brands")}</h2>
            <div className="relative">
              <Swiper
                onSwiper={(swiper) => {
                  brandsSwiperRef.current = swiper;
                }}
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={3}
                breakpoints={{
                  640: {
                    slidesPerView: 4,
                  },
                  768: {
                    slidesPerView: 5,
                  },
                  1024: {
                    slidesPerView: 6,
                  },
                  1280: {
                    slidesPerView: 8,
                  },
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                grabCursor={true}
                className="brands-swiper !py-2"
              >
                {brandsData.brands.map((brand) => {
                  // Handle brand image URL - could be full URL or relative path
                  const brandImageUrl = brand.image_full_url?.path || null;

                  return (
                    <SwiperSlide key={brand.id}>
                      <Link
                        href={`/search?brand=${encodeURIComponent(
                          JSON.stringify([brand.id])
                        )}`}
                        className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      >
                        {brandImageUrl ? (
                          <>
                            <div className="relative w-full aspect-square mb-2">
                              <Image
                                src={brandImageUrl}
                                alt={brand.name}
                                fill
                                className="object-contain rounded-lg"
                                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center line-clamp-2 group-hover:text-primary transition-colors">
                              {brand.name}
                            </span>
                          </>
                        ) : (
                          <div className="w-full aspect-square mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
                            <span className="text-xs font-medium text-gray-500 text-center px-2 line-clamp-2">
                              {brand.name}
                            </span>
                          </div>
                        )}
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Navigation Buttons */}
              {brandsData.brands.length > 8 && (
                <>
                  <button
                    onClick={() => brandsSwiperRef.current?.slidePrev()}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 -ml-4"
                    aria-label={t("previousBrands")}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>

                  <button
                    onClick={() => brandsSwiperRef.current?.slideNext()}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 -mr-4"
                    aria-label={t("nextBrands")}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                </>
              )}
            </div>
          </div>
        )
      )}

      {/* Additional Main Section Banners */}
      {bannersLoading ? (
        <div className="py-6">
          <Skeleton className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl" />
        </div>
      ) : (
        mainSectionBanners.length > 2 &&
        mainSectionBanners.slice(2).map((banner, index) => (
          <div key={banner.id} className=" py-6">
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
        ))
      )}

      <BottomBanners />
    </>
  );
}

export default Page;
