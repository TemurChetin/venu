"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

interface ProductGalleryProps {
  images?: string[];
}

export default function ProductGalleryMobile({
  images = [],
}: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  // Sync Swiper when thumbnail is clicked
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentImage, 300);
    }
  }, [currentImage]);

  return (
    <div className="flex flex-col gap-3 w-full overflow-hidden sticky top-0">
      <div className="relative w-full aspect-square max-h-[450px] overflow-hidden">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentImage(swiper.activeIndex);
          }}
          slidesPerView={1}
          spaceBetween={0}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !w-2 !h-2 !opacity-40",
            bulletActiveClass:
              "swiper-pagination-bullet-active !opacity-100 !bg-primary",
          }}
          modules={[Pagination]}
          className="w-full h-full"
          touchEventsTarget="container"
          resistance={true}
          resistanceRatio={0.85}
        >
          {displayImages.map((img, idx) => (
            <SwiperSlide className="w-full h-full overflow-hidden" key={idx}>
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <Image
                  width={450}
                  height={450}
                  src={img || "/placeholder.svg"}
                  alt={`Product image ${idx + 1}`}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                  priority={idx === 0}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1 px-1 scrollbar-hide -mx-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-14 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 active:scale-95 ${
                currentImage === idx
                  ? "border-primary scale-105 shadow-md"
                  : "border-border opacity-60"
              }`}
              aria-label={`View image ${idx + 1}`}
              style={{ touchAction: "manipulation" }}
            >
              <Image
                width={56}
                height={80}
                src={img || "/placeholder.svg"}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                quality={75}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
