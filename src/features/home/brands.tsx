"use client";
import { useBrands } from "@/services";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BrandSkleton } from "@/components/common/homeSkleton";

export default function Brands() {
  const t = useTranslations("home");
  const brandsSwiperRef = useRef<SwiperType | null>(null);
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  return (
    <div>
      {brandsLoading ? (
        <BrandSkleton />
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
                          JSON.stringify([brand.id]),
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
    </div>
  );
}
