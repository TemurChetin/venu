"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  // Sync Swiper when thumbnail is clicked
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentImage);
    }
  }, [currentImage]);

  return (
    <div className="flex flex-col gap-4 col-span-8">
      <div className="relative h-[350px] md:h-[650px]">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentImage(swiper.activeIndex);
          }}
          slidesPerView={2}
          spaceBetween={16}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="w-full h-full"
        >
          {displayImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image
                  width={800}
                  height={800}
                  src={img || "/placeholder.svg"}
                  alt={`Product image ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  priority={idx === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg z-10 bg-white/90 hover:bg-white"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg z-10 bg-white/90 hover:bg-white"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-16 h-24 md:w-20 md:h-32 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                currentImage === idx
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                width={80}
                height={120}
                src={img || "/placeholder.svg"}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
