"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update current index when initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [initialIndex, isOpen]);

  // Navigate to previous image
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  // Navigate to next image
  const goToNext = () => {
    setCurrentIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for swipe

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left - go to next
        goToNext();
      } else {
        // Swiped right - go to previous
        goToPrevious();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useKeyboardShortcut(["ArrowLeft"], goToPrevious, { preventDefault: true });
  useKeyboardShortcut(["ArrowRight"], goToNext, { preventDefault: true });
  useKeyboardShortcut(["Escape"], onClose, { preventDefault: true });

  if (!isOpen || !mounted) return null;

  const lightboxContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/95 backdrop-blur-sm",
        "animate-in fade-in-0 duration-200"
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full shadow-lg bg-white/90 hover:bg-white"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Previous button */}
        {displayImages.length > 1 && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full shadow-lg bg-white/90 hover:bg-white"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Next button */}
        {displayImages.length > 1 && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full shadow-lg bg-white/90 hover:bg-white"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Main image - clickable for navigation */}
        <div
          ref={imageContainerRef}
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            width={1200}
            height={1200}
            src={displayImages[currentIndex] || "/placeholder.svg"}
            alt={`Product image ${currentIndex + 1}`}
            className="max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none"
            quality={95}
            priority
            draggable={false}
          />
        </div>

        {/* Image counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/60 text-white text-sm backdrop-blur-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Thumbnail strip */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2 bg-black/60 rounded-lg backdrop-blur-sm">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                  currentIndex === idx
                    ? "border-white scale-110"
                    : "border-transparent hover:border-white/50 opacity-70 hover:opacity-100"
                )}
                aria-label={`Go to image ${idx + 1}`}
              >
                <Image
                  width={80}
                  height={80}
                  src={img || "/placeholder.svg"}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}
