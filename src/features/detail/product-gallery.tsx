"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images?: string[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="flex gap-4">
      {displayImages.length > 1 && (
        <div className="flex flex-col gap-3">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-16 h-24 md:w-20 md:h-32 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                currentImage === idx
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <Card className="relative overflow-hidden bg-muted flex-1 h-[350px] md:h-[650px] p-0">
        <img
          src={displayImages[currentImage] || "/placeholder.svg"}
          alt="Product"
          className="w-full h-full object-cover"
        />
        {displayImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? displayImages.length - 1 : prev - 1
                )
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === displayImages.length - 1 ? 0 : prev + 1
                )
              }
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
