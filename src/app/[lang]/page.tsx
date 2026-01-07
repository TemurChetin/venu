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
  useDiscountProducts,
  useSeasonalProducts,
  useBrands,
} from "@/services/queries/products";
import Image from "next/image";
import { BottomBanners } from "@/features/home/bottom-banners";

type Props = {};

function Page({}: Props) {
  // Fetch all product lists
  const { data: latestData, isLoading: latestLoading } = useLatestProducts(
    10,
    0
  );
  const { data: discountData, isLoading: discountLoading } =
    useDiscountProducts(10, 0);
  const { data: seasonalData, isLoading: seasonalLoading } =
    useSeasonalProducts(10, 0);
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

      {/* Seasonal Products */}
      {seasonalData?.products && seasonalData.products.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Mavsumiy mahsulotlar</h2>
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {seasonalData.products.map((product) => (
              <ProductCard key={`seasonal-${product.slug}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Discount Products */}
      {discountData?.products && discountData.products.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Chegirmali mahsulotlar</h2>
          <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {discountData.products.map((product) => (
              <ProductCard key={`discount-${product.slug}`} product={product} />
            ))}
          </div>
        </div>
      )}

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

      {/* Brands Section */}
      {brandsData?.brands && brandsData.brands.length > 0 && (
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold mb-4">Brendlar</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {brandsData.brands.map((brand) => {
              // Handle brand image URL - could be full URL or relative path
              const brandImageUrl = brand.image_full_url?.path || null;

              return (
                <Link
                  key={brand.id}
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
              );
            })}
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
