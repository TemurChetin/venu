"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image: "https://images.uzum.uz/d50ls03s2tab83s6hi10/main_page_banner.jpg",
    alt: "Avtomobil sotib oling - kuniga 161 000 so'mdan",
  },
  {
    id: 2,
    image: "https://images.uzum.uz/d506qp8jsv1neacpatgg/main_page_banner.jpg",
    alt: "Nasiya 2 karra foydali - Xiaomi Redmi 15C smartfoni",
  },
  {
    id: 3,
    image: "https://images.uzum.uz/d50ls03s2tab83s6hi10/main_page_banner.jpg",
    alt: "Avtomobil sotib oling - kuniga 161 000 so'mdan",
  },
  {
    id: 4,
    image: "https://images.uzum.uz/d506qp8jsv1neacpatgg/main_page_banner.jpg",
    alt: "Nasiya 2 karra foydali - Xiaomi Redmi 15C smartfoni",
  },
  {
    id: 5,
    image: "https://images.uzum.uz/d50ls03s2tab83s6hi10/main_page_banner.jpg",
    alt: "Avtomobil sotib oling - kuniga 161 000 so'mdan",
  },
  {
    id: 6,
    image: "https://images.uzum.uz/d506qp8jsv1neacpatgg/main_page_banner.jpg",
    alt: "Nasiya 2 karra foydali - Xiaomi Redmi 15C smartfoni",
  },
  {
    id: 7,
    image: "https://images.uzum.uz/d50ls03s2tab83s6hi10/main_page_banner.jpg",
    alt: "Avtomobil sotib oling - kuniga 161 000 so'mdan",
  },
  {
    id: 8,
    image: "https://images.uzum.uz/d506qp8jsv1neacpatgg/main_page_banner.jpg",
    alt: "Nasiya 2 karra foydali - Xiaomi Redmi 15C smartfoni",
  },
];

export function Carousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full px-4 py-8">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1.2}
        centeredSlides={true}
        rewind={true}
        grabCursor={true}
        speed={400}
        initialSlide={2}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.4,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 1.5,
            spaceBetween: 32,
          },
        }}
        className="promo-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="overflow-hidden rounded-2xl">
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.alt}
                className="w-full h-auto object-cover aspect-[16/7]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110"
        aria-label="Oldingi"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110"
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

        .promo-swiper .swiper-slide {
          opacity: 0.5;
        }

        .promo-swiper .swiper-slide-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
