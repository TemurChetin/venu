"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import { useBanners } from "@/services/queries/products";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export function Carousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: bannersData, isLoading } = useBanners();

  const slides =
    bannersData?.filter(
      (banner) => banner.banner_type === "Main Banner" && banner.published === 1
    ) || [];

  if (isLoading) {
    return (
      <div className="relative w-full px-4 py-8">
        <div className="w-full lg:h-[600px] h-[200px] md:h-[300px] bg-gray-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full px-0 py-8">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        rewind={true}
        grabCursor={true}
        speed={400}
        initialSlide={0}
        pagination={{
          clickable: true,
        }}
        className="promo-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {slide.url ? (
              <Link
                href={slide.url}
                className="block overflow-hidden rounded-2xl hover:opacity-90 transition-opacity"
              >
                <Image
                  width={1920}
                  height={720}
                  src={slide.photo_full_url?.path || "/placeholder.svg"}
                  alt={slide.title || ""}
                  className="w-full h-auto object-contain aspect-[8/3]"
                />
              </Link>
            ) : (
              <div className="overflow-hidden rounded-2xl">
                <Image
                  width={800}
                  height={800}
                  src={slide.photo_full_url?.path || "/placeholder.svg"}
                  alt={slide.title || ""}
                  className="w-full h-auto object-contain aspect-[8/3]"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - Hidden on mobile */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110"
        aria-label="Oldingi"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110"
        aria-label="Keyingi"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>

      <style jsx global>{`
        .promo-swiper .swiper-pagination {
          position: relative;
          margin-top: 16px;
        }

        .promo-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
        }

        .promo-swiper .swiper-pagination-bullet-active {
          background: #6366f1;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
