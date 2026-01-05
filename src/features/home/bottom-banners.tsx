"use client";

import Image from "next/image";
import Link from "next/link";
import { useBanners } from "@/services/queries/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function BottomBanners() {
  const swiperRef = useRef<SwiperType | null>(null);
  // Fetch banners
  const { data: bannersData, isLoading: bannersLoading } = useBanners();

  // Filter Footer Banners (published only)
  const footerBanners =
    bannersData?.filter(
      (banner) =>
        banner.banner_type === "Footer Banner" && banner.published === 1
    ) || [];

  return (
    <div className="border-t bg-background mt-12">
      {/* Footer Banners */}
      {bannersLoading ? (
        <div className="container mx-auto px-4 py-8">
          <div className="w-full h-32 md:h-40 bg-gray-200 animate-pulse rounded-xl" />
        </div>
      ) : (
        footerBanners.length > 0 && (
          <div className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-6 md:py-8">
              <div className="relative">
                <Swiper
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={1}
                  centeredSlides={false}
                  rewind={true}
                  grabCursor={true}
                  speed={400}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                  className="footer-banner-swiper"
                >
                  {footerBanners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                      <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        {banner.url ? (
                          <Link
                            href={banner.url}
                            className="block w-full h-full"
                            aria-label={banner.title || "Banner"}
                          >
                            <div className="relative w-full aspect-[828/413] overflow-hidden rounded-xl">
                              <Image
                                width={828}
                                height={413}
                                src={
                                  banner.photo_full_url?.path ||
                                  "/placeholder.svg"
                                }
                                alt={banner.title || "Banner"}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </Link>
                        ) : (
                          <div className="relative w-full aspect-[828/413] overflow-hidden rounded-xl">
                            <Image
                              width={828}
                              height={413}
                              src={
                                banner.photo_full_url?.path ||
                                "/placeholder.svg"
                              }
                              alt={banner.title || "Banner"}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                {footerBanners.length > 1 && (
                  <>
                    <button
                      onClick={() => swiperRef.current?.slidePrev()}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 items-center justify-center"
                      aria-label="Oldingi"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>

                    <button
                      onClick={() => swiperRef.current?.slideNext()}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 items-center justify-center"
                      aria-label="Keyingi"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-800" />
                    </button>
                  </>
                )}

                <style jsx global>{`
                  .footer-banner-swiper .swiper-pagination {
                    position: relative;
                    margin-top: 20px;
                  }

                  .footer-banner-swiper .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: #d1d5db;
                    opacity: 1;
                  }

                  .footer-banner-swiper .swiper-pagination-bullet-active {
                    background: #6366f1;
                    width: 24px;
                    border-radius: 4px;
                  }
                `}</style>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
